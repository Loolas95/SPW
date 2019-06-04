package com.ait.repository;

import com.ait.model.Message;
import com.ait.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findAllByChatId(String postId);
    List<Message> deleteAllByChatId(String postId);
}
