package com.ait.util;

import com.ait.model.Comment;
import com.ait.model.Post;
import com.ait.model.User;
import com.ait.repository.CommentRepository;
import com.ait.repository.PostRepository;
import com.ait.repository.UserRepository;
import org.fluttercode.datafactory.impl.DataFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class DatabaseInitilizer implements ApplicationRunner {
    private static final Logger LOG =
            LoggerFactory.getLogger(DatabaseInitilizer.class);

    private PostRepository postRepository;
    private UserRepository userRepository;
    private CommentRepository commentRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public DatabaseInitilizer(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository,BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    @Override
    public void run(ApplicationArguments args) throws Exception {

        LOG.info("Application started with option names : {}",
                Arrays.toString(args.getSourceArgs()));

        String command = Arrays.toString(args.getSourceArgs());

        if(command.equals("[initialize]")) {

            LOG.info("Initilizing Database with random data");
            initilizeData();

        }

    }

    public void initilizeData() {

        DataFactory dataFactory = new DataFactory();
        User user;
        Post post;
        Comment comment;
        List<User> userArrayList = new ArrayList<>();

        Random rand = new Random();

        for (int i = 0; i < 10; i++) {

            user = new User();
            user.setUsername(dataFactory.getRandomWord(4,10));
            user.setPassword("password");
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            user.setRole("user");
            userRepository.save(user);
            userArrayList.add(user);

        }

        user = new User();
        user.setUsername("admin");
        user.setPassword("password");
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("admin");
        userRepository.save(user);
        userArrayList.add(user);

        for (int i = 0; i < 100; i++) {

            post = new Post();
            StringBuilder name = new StringBuilder();
            for (int j = 0; j < 10; j++) {
                name.append(dataFactory.getRandomWord(4,10));
                name.append(" ");
            }
            post.setName(name.toString());
            StringBuilder content = new StringBuilder();
            for (int j = 0; j < 300; j++) {
                content.append(dataFactory.getRandomWord(4,10));
                content.append(" ");
            }
            post.setContent(content.toString());
            post.setAuthor(userArrayList.get(rand.nextInt(userArrayList.size())).getUsername());
            post.setTags(Arrays.asList(dataFactory.getRandomWord(),dataFactory.getRandomWord(),dataFactory.getRandomWord()));
            postRepository.save(post);

            for (int j = 0; j < 10; j++) {

                comment = new Comment();

                StringBuilder commentContent = new StringBuilder();
                for (int k = 0; k < 50; k++) {
                    commentContent.append(dataFactory.getRandomWord(4,10));
                    commentContent.append(" ");
                }

                comment.setContent(commentContent.toString());
                comment.setPostId(post.getId());
                comment.setAuthor(userArrayList.get(rand.nextInt(userArrayList.size())).getUsername());
                commentRepository.save(comment);
            }

        }

        System.exit(1);

    }
}
