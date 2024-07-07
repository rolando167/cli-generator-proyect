package com.api.h2.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.api.h2.Entities.Example;

public interface ExampleRepository extends JpaRepository<Example, Long> {

    @Query(value = "Select * from examples a where name like %:fil%", nativeQuery = true)
    public abstract List<Example> listarExampleNombre(@Param("fil") String nombre);
}