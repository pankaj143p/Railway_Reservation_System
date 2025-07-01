package com.microservices.service;

import com.microservices.config.JwtUtil;
import com.microservices.dto.AuthResponse;
import com.microservices.dto.LoginRequest;
import com.microservices.dto.RegisterRequest;
import com.microservices.exception.UserException;
import com.microservices.model.User;
import com.microservices.repository.UserRepository;
import com.microservices.services.implementation.UserServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplementationTest {

	@Mock
	private UserRepository userRep;
	@Mock
	private PasswordEncoder passwordEncoder;
	@Mock
	private JwtUtil jwtUtil;

	@InjectMocks
	private UserServiceImplementation userService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	// --- normalizeRole ---
	@Test
	void normalizeRole_returnsRoleAdminAndUser() {
		assertEquals("ROLE_ADMIN", userService.normalizeRole("admin"));
		assertEquals("ROLE_ADMIN", userService.normalizeRole("ADMIN"));
		assertEquals("ROLE_USER", userService.normalizeRole("user"));
		assertEquals("ROLE_USER", userService.normalizeRole("USER"));
		assertEquals("ROLE_USER", userService.normalizeRole(null));
		assertThrows(IllegalArgumentException.class, () -> userService.normalizeRole("manager"));
	}

	
	@Test
	void createUser_withIndianUserData_success() throws UserException {
		RegisterRequest req = new RegisterRequest();
		req.setFullName("Amit Sharma");
		req.setEmail("amit.sharma@gmail.com");
		req.setPhone("9876543210");
		req.setPassword("StrongPass123");
		req.setRole("user");

		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.empty());
		when(passwordEncoder.encode("StrongPass123")).thenReturn("encodedPassword");
		when(userRep.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

		User user = userService.createUser(req);

		assertEquals("Amit Sharma", user.getFullName());
		assertEquals("amit.sharma@gmail.com", user.getEmail());
		assertEquals("9876543210", user.getPhone());
		assertEquals("encodedPassword", user.getPassword());
		assertEquals("ROLE_USER", user.getRole());
	}

	@Test
	void createUser_duplicateEmail_throwsException() {
		RegisterRequest req = new RegisterRequest();
		req.setEmail("amit.sharma@gmail.com");
		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.of(new User()));

		assertThrows(UserException.class, () -> userService.createUser(req));
	}

	@Test
	void loginUser_withIndianUserData_success() throws UserException {
		LoginRequest req = new LoginRequest();
		req.setEmail("amit.sharma@gmail.com");
		req.setPassword("StrongPass123");

		User user = new User();
		user.setEmail("amit.sharma@gmail.com");
		user.setPassword("encodedPassword");
		user.setRole("ROLE_USER");

		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("StrongPass123", "encodedPassword")).thenReturn(true);
		when(jwtUtil.generateToken("amit.sharma@gmail.com", "ROLE_USER")).thenReturn("jwt-token");

		AuthResponse res = userService.loginUser(req);

		assertEquals("jwt-token", res.getToken());
	}

	@Test
	void loginUser_invalidPassword_throwsException() {
		LoginRequest req = new LoginRequest();
		req.setEmail("amit.sharma@gmail.com");
		req.setPassword("wrong");

		User user = new User();
		user.setEmail("amit.sharma@gmail.com");
		user.setPassword("encodedPassword");
		user.setRole("ROLE_USER");

		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.of(user));
		when(passwordEncoder.matches("wrong", "encodedPassword")).thenReturn(false);

		assertThrows(RuntimeException.class, () -> userService.loginUser(req));
	}

	@Test
	void loginUser_userNotFound_throwsException() {
		LoginRequest req = new LoginRequest();
		req.setEmail("notfound@gmail.com");
		req.setPassword("password");

		when(userRep.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> userService.loginUser(req));
	}

	// --- getUserById with  ---
	@Test
	void getUserById_success() throws UserException {
		User user = new User();
		user.setId(1L);
		user.setFullName("Amit Sharma");
		when(userRep.findById(1L)).thenReturn(Optional.of(user));

		User found = userService.getUserById(1L);
		assertEquals(1L, found.getId());
		assertEquals("Amit Sharma", found.getFullName());
	}

	@Test
	void getUserById_notFound_throwsException() {
		when(userRep.findById(1L)).thenReturn(Optional.empty());
		assertThrows(UserException.class, () -> userService.getUserById(1L));
	}

	// --- getAllUsers with  ---
	@Test
	void getAllUsers_returnsList() {
		User user1 = new User();
		user1.setFullName("Amit Sharma");
		User user2 = new User();
		user2.setFullName("Priya Singh");
		List<User> users = Arrays.asList(user1, user2);
		when(userRep.findAll()).thenReturn(users);

		List<User> result = userService.getAllUsers();
		assertEquals(2, result.size());
		assertEquals("Amit Sharma", result.get(0).getFullName());
		assertEquals("Priya Singh", result.get(1).getFullName());
	}

	// --- deleteUser with  ---
	@Test
	void deleteUser_notFound_throwsException() {
		when(userRep.findById(1L)).thenReturn(Optional.empty());
		assertThrows(UserException.class, () -> userService.deleteUser(1L));
	}

	@Test
	void deleteUser_success() throws UserException {
		User user = new User();
		user.setId(1L);
		user.setFullName("Amit Sharma");
		when(userRep.findById(1L)).thenReturn(Optional.of(user));
		doNothing().when(userRep).deleteById(1L);

		assertDoesNotThrow(() -> userService.deleteUser(1L));
		verify(userRep).deleteById(1L);
	}

	// --- updateUser with  ---
	@Test
	void updateUser_notFound_throwsException() {
		when(userRep.findById(1L)).thenReturn(Optional.empty());
		assertThrows(UserException.class, () -> userService.updateUser(1L, new User()));
	}

	@Test
	void updateUser_success() throws UserException {
		User existing = new User();
		existing.setId(1L);
		existing.setFullName("Amit Sharma");
		existing.setEmail("amit.sharma@gmail.com");
		existing.setRole("ROLE_USER");
		existing.setPhone("9876543210");

		User update = new User();
		update.setFullName("Priya Singh");
		update.setEmail("priya.singh@gmail.com");
		update.setRole("ROLE_ADMIN");
		update.setPhone("9123456789");

		when(userRep.findById(1L)).thenReturn(Optional.of(existing));
		when(userRep.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

		User result = userService.updateUser(1L, update);

		assertEquals("Priya Singh", result.getFullName());
		assertEquals("priya.singh@gmail.com", result.getEmail());
		assertEquals("ROLE_ADMIN", result.getRole());
		assertEquals("9123456789", result.getPhone());
	}

	// --- validateToken with  ---
	@Test
	void validateToken_success() {
		when(jwtUtil.validateToken("token")).thenReturn("amit.sharma@gmail.com");
		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.of(new User()));

		assertDoesNotThrow(() -> userService.validateToken("token"));
	}

	@Test
	void validateToken_invalid_throwsException() {
		when(jwtUtil.validateToken("token")).thenReturn("amit.sharma@gmail.com");
		when(userRep.findByEmail("amit.sharma@gmail.com")).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> userService.validateToken("token"));
	}
}