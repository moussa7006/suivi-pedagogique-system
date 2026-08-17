package com.suiviPedagogique.edutrack;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.sql.DataSource;

@SpringBootApplication
@EnableScheduling
public class EdutrackApplication {

	public static void main(String[] args) {
		SpringApplication.run(EdutrackApplication.class, args);
	}

	@Bean
	@Order(1)
	public CommandLineRunner initData(DataSource dataSource, JdbcTemplate jdbcTemplate,
									  @Value("${app.init-db.enabled:true}") boolean initDbEnabled) {
		return args -> {
			if (!initDbEnabled) {
				return;
			}

			try {
				// Vérifier si la table 'utilisateur' est vide (ce qui indique que la DB n'a pas encore de données)
				Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM utilisateur", Integer.class);
				if (count != null && count == 0) {
					System.out.println("Aucune donnée trouvée dans la base de données. Initialisation avec data.sql...");
					ResourceDatabasePopulator populator = new ResourceDatabasePopulator(new ClassPathResource("data.sql"));
					// data.sql ne contient plus de méta-commandes psql : on laisse les erreurs remonter
					// pour ne pas masquer un échec réel d'initialisation.
					populator.setContinueOnError(false);
					populator.execute(dataSource);
					System.out.println("Initialisation de la base de données terminée.");
				} else {
					System.out.println("La base de données contient déjà des données. Ignorer data.sql.");
				}
			} catch (Exception e) {
				System.err.println("Erreur lors de la vérification ou de l'initialisation de la base de données : " + e.getMessage());
			}
		};
	}

}
