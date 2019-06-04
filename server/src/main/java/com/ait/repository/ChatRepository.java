package com.ait.repository;

import com.ait.model.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findAllById(String user1Id);
    List<Chat> findAllByUserFrom(String userId);
    Page<Chat> findByUserFromOrUserTo(String userId,String userId2, Pageable pageable);

}
