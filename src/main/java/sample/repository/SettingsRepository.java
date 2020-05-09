package sample.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sample.model.Settings;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long> {

	Settings findByName(String name);

}
