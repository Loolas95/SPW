package com.ait.repository;

import com.ait.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String>{

    List<Comment> findAllByPostId(String postId);
    List<Comment> deleteAllByPostId(String postId);

}
