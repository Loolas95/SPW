package com.ait.controller;

import com.ait.model.Message;
import com.ait.model.User;
import com.ait.repository.MessageRepository;
import com.ait.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
public class MessagesController {
    private UserRepository userRepository;
    private MessageRepository messageRepository;

    public MessagesController(UserRepository userRepository, MessageRepository messageRepository) {
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
    }

    @GetMapping("/message/chatId/{chatId}")
    public List<Message> getMessageById(@PathVariable("chatId") String chatId) {

        return messageRepository.findAllByChatId(chatId);

    }

    @PostMapping("/message/create")
    public Message createPost(@Valid @RequestBody Message message) {

        System.out.println(SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        message.setAuthor(user.getUsername());

        return messageRepository.save(message);

    }

    @GetMapping("/message/{id}")
    public ResponseEntity<Message> getPost(@PathVariable("id") String id) {

        if(messageRepository.findById(id).isPresent()) {

            return new ResponseEntity<>(messageRepository.findById(id).get(), HttpStatus.OK);

        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }

    @PutMapping("/message/{id}")
    public ResponseEntity<Message> updatePost(@PathVariable("id") String id, @RequestBody Message message) {

        if(messageRepository.findById(id).isPresent()) {

            Message data = messageRepository.findById(id).get();
            Message update = messageRepository.save(data);
            return new ResponseEntity<>(update, HttpStatus.OK);

        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);


    }

    @DeleteMapping("/message/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable("id") String id) {

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        Message message;

        if(messageRepository.findById(id).isPresent()) {

            message = messageRepository.findById(id).get();

        } else {

            return new ResponseEntity<>("There is no such message!", HttpStatus.NOT_FOUND);

        }

        if(Objects.equals(user.getRole(), "admin") || Objects.equals(user.getRole(), "moderator") || Objects.equals(user.getUsername(), message.getAuthor())) {

            messageRepository.deleteById(id);
            return new ResponseEntity<>("Entry has been deleted!", HttpStatus.OK);

        }

        return new ResponseEntity<>("You can't do this!", HttpStatus.FORBIDDEN);

    }
}
