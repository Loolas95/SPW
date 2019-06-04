package com.ait.controller;


import com.ait.model.Chat;
import com.ait.model.Post;
import com.ait.model.User;
import com.ait.repository.ChatRepository;
import com.ait.repository.MessageRepository;
import com.ait.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@CrossOrigin
@RestController
public class ChatController {
    private ChatRepository chatRepository;
    private UserRepository userRepository;
    private MessageRepository messageRepository;


    public ChatController(ChatRepository chatRepository, UserRepository userRepository, MessageRepository messageRepository) {
        this.chatRepository = chatRepository;
        this.userRepository=userRepository;
        this.messageRepository=messageRepository;
    }


    @GetMapping("/chat/{id}")
    public ResponseEntity<Chat> getChat(@PathVariable("id") String id) {

        if(chatRepository.findById(id).isPresent()) {

            return new ResponseEntity<>(chatRepository.findById(id).get(), HttpStatus.OK);

        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);

    }
    @GetMapping("/chat/userId/{id}")
    public Page<Chat> getChatByUser(@PathVariable("id") String id,Pageable pageable) {

        return chatRepository.findByUserFromOrUserTo(id,id,pageable);

    }
    @GetMapping("/chat")
    public Page<Chat> listAll(Pageable pageable) {

        return chatRepository.findAll(pageable);

    }


    @PostMapping("/chat/create")
    public Chat createChat(@Valid @RequestBody Chat chat) {

        System.out.println(SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        chat.setUserFrom(user.getUsername());

        return chatRepository.save(chat);

    }
    @DeleteMapping("/chat/{id}")
    public ResponseEntity<String> deleteChat(@PathVariable("id") String id) {

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        Chat chat;

        if(chatRepository.findById(id).isPresent()) {

            chat = chatRepository.findById(id).get();

        } else {

            return new ResponseEntity<>("There is no such post!", HttpStatus.NOT_FOUND);

        }

        if(Objects.equals(user.getRole(), "admin") || Objects.equals(user.getRole(), "moderator") || Objects.equals(user.getUsername(), chat.getUserFrom())) {

            chatRepository.deleteById(id);
            messageRepository.deleteAllByChatId(id);
            return new ResponseEntity<>("Entry and it's messages has been deleted!", HttpStatus.OK);

        }

        return new ResponseEntity<>("You can't do this!", HttpStatus.FORBIDDEN);

    }


}
