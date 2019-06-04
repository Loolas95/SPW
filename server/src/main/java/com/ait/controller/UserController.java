package com.ait.controller;

import com.ait.repository.UserRepository;
import com.ait.model.User;
import com.mongodb.MongoWriteException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/")
public class UserController {

    private UserRepository userRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserController(UserRepository userRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/users")
    public List<User> getUsers() {

        return userRepository.findAll();

    }
    @GetMapping("/panel")
    public ResponseEntity<List<User>> listAll() {

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        if(Objects.equals(user.getRole(), "admin")) {

            return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);

        }

        return new ResponseEntity<>(HttpStatus.FORBIDDEN);

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/register")
    public ResponseEntity<String> signUp(@RequestBody User user) {

        if(user.getPassword().isEmpty() || user.getUsername().isEmpty() ) return new ResponseEntity<>("Something went wrong" , HttpStatus.BAD_REQUEST);

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRole("user");

        try {

            userRepository.save(user);

        } catch (MongoWriteException e) {

            System.out.println("UserController: User already Exist");
            return new ResponseEntity<>("User already Exist" , HttpStatus.CONFLICT);

        }

        return new ResponseEntity<>("User created" , HttpStatus.OK);

    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping("/panel/{id}")
    public ResponseEntity<String> setRole(@PathVariable("id") String id, @RequestBody User user) {

        User principal = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );
        User update;
        if(userRepository.findById(id).isPresent()) {

            update = userRepository.findById(id).get();

        } else {

            return new ResponseEntity<>("There is no such user!", HttpStatus.NOT_FOUND);

        }

        if(Objects.equals(principal.getRole(), "admin") && (Objects.equals(user.getRole(), "user") || Objects.equals(user.getRole(), "moderator")) ) {

            update.setRole(user.getRole());
            userRepository.save(update);
            return new ResponseEntity<>("User deleted!", HttpStatus.OK);

        }

        return new ResponseEntity<>("You can't do this!", HttpStatus.FORBIDDEN);

    }

    @DeleteMapping("/panel/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") String id) {

        User user = userRepository.findByUsername( (String)SecurityContextHolder.getContext().getAuthentication().getPrincipal() );

        if(Objects.equals(user.getRole(), "admin")) {

            userRepository.deleteById(id);
            return new ResponseEntity<>("User deleted!", HttpStatus.OK);

        }

        return new ResponseEntity<>("You can't do this!", HttpStatus.FORBIDDEN);

    }

}
