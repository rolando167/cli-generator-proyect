package com.api.h2.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.h2.Entities.Autor;

public interface AutorRepository extends JpaRepository<Autor, Long> {

    @Query(value = "Select * from examples a where name like %:fil%", nativeQuery = true)
    public abstract List<Autor> listarAutorNombre(@Param("fil") String nombre);
}