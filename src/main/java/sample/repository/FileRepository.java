package sample.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sample.model.FileModel;
import sample.model.User;

@Repository
public interface FileRepository extends JpaRepository<FileModel, Long> {

  User findByFileName(String fileName);

  @Query("from FileModel f where f.fileName=:fileName")
  User findUser(@Param("fileName") String fileName);

  
}
