package com.suiviPedagogique.edutrack.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.suiviPedagogique.edutrack.Dto.SalleDto;
import com.suiviPedagogique.edutrack.Entities.Salle;
import com.suiviPedagogique.edutrack.repositories.SalleRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SalleServiceTest {

    @Mock
    private SalleRepository salleRepository;

    @InjectMocks
    private SalleService salleService;

    @Test
    void getAllGeneratesMissingDisplayToken() {
        Salle salle = new Salle(1, "Salle 101", "Bloc A", 40, "Projecteur", "192.168.1.20", null);
        when(salleRepository.findAll()).thenReturn(List.of(salle));
        when(salleRepository.findByTokenAffichage(anyString())).thenReturn(Optional.empty());
        when(salleRepository.save(any(Salle.class))).thenAnswer(invocation -> invocation.getArgument(0));

        List<SalleDto> result = salleService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTokenAffichage()).matches("SALLE-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}");
        verify(salleRepository).save(salle);
    }

    @Test
    void createPersistsSalleWithGeneratedToken() {
        SalleDto dto = new SalleDto(null, "Lab 1", "Bloc B", 25, "PC", "10.0.0.5", null);
        when(salleRepository.findByTokenAffichage(anyString())).thenReturn(Optional.empty());
        when(salleRepository.save(any(Salle.class))).thenAnswer(invocation -> {
            Salle salle = invocation.getArgument(0);
            salle.setId(7);
            return salle;
        });

        SalleDto result = salleService.create(dto);

        ArgumentCaptor<Salle> captor = ArgumentCaptor.forClass(Salle.class);
        verify(salleRepository).save(captor.capture());
        assertThat(captor.getValue().getTokenAffichage()).matches("SALLE-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}");
        assertThat(result.getId()).isEqualTo(7);
        assertThat(result.getNom()).isEqualTo("Lab 1");
    }

    @Test
    void getAllKeepsExistingDisplayToken() {
        Salle salle = new Salle(2, "Salle 202", "Bloc C", 60, "Tableau", null, "SALLE-ABCD-EFGH-2345");
        when(salleRepository.findAll()).thenReturn(List.of(salle));

        List<SalleDto> result = salleService.getAll();

        assertThat(result.get(0).getTokenAffichage()).isEqualTo("SALLE-ABCD-EFGH-2345");
        verify(salleRepository, never()).save(any(Salle.class));
    }
}
