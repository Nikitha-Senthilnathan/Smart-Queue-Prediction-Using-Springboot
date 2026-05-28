package com.smartqueue.Backend;

import com.smartqueue.Backend.service.AuthService;
import com.smartqueue.Backend.service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

	@Autowired
	private AuthService authService;

	@Autowired
	private BranchService branchService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		authService.createDefaultUsers();
		branchService.createDefaultBranches();
	}
}