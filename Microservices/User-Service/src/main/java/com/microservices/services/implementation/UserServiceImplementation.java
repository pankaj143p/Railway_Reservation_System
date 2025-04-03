package com.microservices.services.implementation;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.repository.UserRepository;
import com.microservices.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImplementation implements UserService {

    private final UserRepository userRep;

    @Override
    public User createUser(User user) {
        return userRep.save(user);
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
