package com.ait.repository;

import com.ait.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String>{

    List<Post> findAllByTags(String tags);
    List<Post> findAllByAuthor(String author);

}
