package com.microservices.services.implementation;
import com.microservices.config.JwtUtil;
import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.repository.UserRepository;
import com.microservices.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRep;

    private final PasswordEncoder passwordEncoder;

    public String createUser(RegisterRequest request) {
        if (userRep.findByEmail(request.getEmail()).isPresent()) {
            return "User with this email already exists!";
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        userRep.save(user);
        return "User registered successfully!";
    }

    @Override
    public AuthResponse loginUser(LoginRequest req) {
        Optional<User> userOpt = userRep.findByEmail(req.getEmail());
        if(userOpt.isPresent()){
            User user = userOpt.get();
            if(passwordEncoder.matches(req.getPassword(), user.getPassword())){
                String token = JwtUtil.generateToken(user.getEmail());
                return new AuthResponse(token);
            }
        }
        throw new RuntimeException("Invalid email or password");
    }


    @Override
    public User getUserById(Long id) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isPresent()){
            return otp.get();
        }
        throw new UserException("User not found with id: "+id);
    }

    @Override
    public List<User> getAllUsers() {
        return userRep.findAll();
    }

    @Override
    public void deleteUser(Long id) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isEmpty()){
            throw new UserException("User not found with id : "+id);
        }
        userRep.deleteById(id);
    }

    @Override
    public User updateUser(Long id, User user) throws UserException {
        Optional<User> otp = userRep.findById(id);
        if(otp.isEmpty()){
            throw new UserException("User not found with id : "+id);
        }
        User exUser = otp.get();
        exUser.setFullName(user.getFullName());
        exUser.setEmail(user.getEmail());
        exUser.setRole(user.getRole());
        exUser.setPhone(user.getPhone());
        return userRep.save(exUser);
    }
}