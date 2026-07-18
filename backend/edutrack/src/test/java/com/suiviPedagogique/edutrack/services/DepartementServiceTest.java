package com.suiviPedagogique.edutrack.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.suiviPedagogique.edutrack.Dto.DepartementDto;
import com.suiviPedagogique.edutrack.Entities.Departement;
import com.suiviPedagogique.edutrack.repositories.DepartementRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class DepartementServiceTest {

    @Mock
    private DepartementRepository departementRepository;

    @InjectMocks
    private DepartementService departementService;

    @Test
    void getAllMapsEntitiesToDtos() {
        when(departementRepository.findAll()).thenReturn(List.of(
                new Departement(1, "Informatique"),
                new Departement(2, "Gestion")
        ));

        List<DepartementDto> result = departementService.getAll();

        assertThat(result).extracting(DepartementDto::getLibelle)
                .containsExactly("Informatique", "Gestion");
    }

    @Test
    void createPersistsLibelleAndReturnsDto() {
        when(departementRepository.save(any(Departement.class)))
                .thenAnswer(invocation -> {
                    Departement departement = invocation.getArgument(0);
                    departement.setId(10);
                    return departement;
                });

        DepartementDto result = departementService.create(new DepartementDto(null, "Réseaux"));

        ArgumentCaptor<Departement> captor = ArgumentCaptor.forClass(Departement.class);
        verify(departementRepository).save(captor.capture());
        assertThat(captor.getValue().getLibelle()).isEqualTo("Réseaux");
        assertThat(result.getId()).isEqualTo(10);
        assertThat(result.getLibelle()).isEqualTo("Réseaux");
    }

    @Test
    void getByIdThrowsWhenDepartementDoesNotExist() {
        when(departementRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> departementService.getById(99))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Département non trouvé");
    }
}
