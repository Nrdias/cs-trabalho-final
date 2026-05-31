package com.sarc.academic.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SemestreRepository extends JpaRepository<Semestre, Long> {
    Optional<Semestre> findByAtivoTrue();
}
