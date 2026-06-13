package com.suiviPedagogique.edutrack.repositories;

import com.suiviPedagogique.edutrack.Entities.DetailHonoraire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailHonoraireRepository extends JpaRepository<DetailHonoraire, Integer> {
    boolean existsBySeanceId(Integer seanceId);

    List<DetailHonoraire> findByHonorairesCalculsId(Integer honorairesCalculsId);
}
