#! /usr/bin/env node
import prompts, { PromptObject } from "prompts";
import fs, { writeFile } from 'fs'
import path from "path";
import shell from 'shelljs'

let NOMBRE_INGRESADO: string = "";

const questions: PromptObject[] = [
    {
        type: 'text',
        name: 'projectName',
        message: 'Cual es el Nombre del Proyecto? .',
        validate: name => name.trim().length < 1 || typeof name !== 'string' ?
            'Project name is required' : true

    },
    {
        type: 'select',
        name: 'templateName',
        message: 'Cual plantilla quiere generar ?',
        validate: name => name.trim().length < 1 ?
            'Template name is required' : true,
        choices: [
            {
                title: '0. Test',
                value: 'api-rest-java-v0'
            },
            {
                title: '1. Api Rest Java Individual',
                value: 'api-rest-java-v1'
            },
            {
                title: '2. Api Rest Java One to One',
                value: 'api-rest-java-v1'
            },
            {
                title: '3. Api Rest Java One to Many',
                value: 'api-rest-java-v1'
            },
            {
                title: '4. Api Rest Java Many to Manyy',
                value: 'api-rest-java-v1'
            }
        ]
    }
];

prompts(questions)
    .then((answers) => {
        NOMBRE_INGRESADO = answers.projectName;
        const projectName = answers.projectName
        const templateName = answers.templateName
        console.log(process.cwd());

        const projectPath = path.join(process.cwd(), projectName)

        // const templatePath = path.join(process.cwd(), 'templates', templateName) original 🚩
        const templatePath = path.join("C:/www/nodejs/yt/2024/project-generator-with-cli", 'templates', templateName)
        console.warn("templatePath ---------------" + templatePath);

        replicateTemplates(templatePath, projectPath)
    }
    )
    .catch(error => console.error(error.message))


const replicateTemplates = (
    templatePath: string, projectPath: string
) => {

    //Get template files names
    let templateFilesNames = fs.readdirSync(templatePath)

    //filter out skip list
    const filesToBeSkipped = ['node_modules', 'build', 'dist']
    templateFilesNames = templateFilesNames.filter(
        name => !filesToBeSkipped.includes(name)
    )

    //Create new project directory
    if (!fs.existsSync(projectPath)) {
        fs.mkdirSync(projectPath)
    } else {
        console.error(
            'Directory already exists. Choose another name'
        )
        return
    }

    templateFilesNames.forEach(name => {
        // ------- 🚩
        const fileExt = name.split('.').pop();
        const nuevo_nombre_ext = NOMBRE_INGRESADO + "." + fileExt;
        const nuevo_nombre = name.replace("Example", NOMBRE_INGRESADO);
        // -------
        const originPath = path.join(templatePath, name)
        const destinationPath = path.join(projectPath, nuevo_nombre)
        const stats = fs.statSync(originPath)

        console.log("File/Folder ---------------> " + nuevo_nombre);
        if (stats.isFile()) {
            console.log("isFile");
            const content = fs.readFileSync(originPath, 'utf8')
            fs.writeFileSync(destinationPath, content.replaceAll("Example", NOMBRE_INGRESADO))
        } else if (stats.isDirectory()) {
            console.log("isDirectory");

            replicateTemplates(originPath, destinationPath)
        }
        // if (stats.isFile()) {
        //     const content = fs.readFileSync(originPath, 'utf8')
        //     fs.writeFileSync(destinationPath, content)

        // } else if (stats.isDirectory()) {
        //     replicateTemplates(originPath, destinationPath)
        // }
    })

    //Run post process commands
    //Check if the template directory contains package.json
    if (templateFilesNames.includes('package.json')) {
        //change directory into project path
        shell.cd(projectPath)

        //Run npm install

        shell.exec('npm install')
    }
}
