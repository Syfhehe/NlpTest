package sample.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sample.model.FileAccessHistory;

@Repository
public interface HistoryRepository extends JpaRepository<FileAccessHistory, Long> {

  @Query("from FileAccessHistory f where f.user.id=:userId and f.fileModel.id =:fileId")
  List<FileAccessHistory> findFileAccessHistory(@Param("userId") Long userId,
      @Param("fileId") Long fileId);

  @Query("from FileAccessHistory f where f.user.id=:userId and f.fileModel.id =:fileId and f.accessDate <=:accessDateEnd and  f.accessDate >=:accessDateStart")
  List<FileAccessHistory> findAllByAccessDateBetween(@Param("userId") Long userId,
      @Param("fileId") Long fileId, @Param("accessDateStart") Date accessDateStart,
      @Param("accessDateEnd") Date accessDateEnd);

  @Query("select max(f.accessDate) from FileAccessHistory f where f.user.id=:userId and f.fileModel.id =:fileId")
  Date findLastestDateById(@Param("userId") Long userId, @Param("fileId") Long fileId);

}
