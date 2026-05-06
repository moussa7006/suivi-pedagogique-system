package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.HonorairesCalculs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HonorairesCalculsRepository extends JpaRepository<HonorairesCalculs, Integer> {
}
