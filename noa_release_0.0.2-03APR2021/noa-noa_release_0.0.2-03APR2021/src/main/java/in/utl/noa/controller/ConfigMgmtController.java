package in.utl.noa.controller;

import org.apache.log4j.Logger;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/config")
public class ConfigMgmtController {

	private static Logger logger = Logger.getLogger(ConfigMgmtController.class);

	public ConfigMgmtController() {
		super();
	}

	@GetMapping(path = "/test123")
	public String test() {
		return "Test Success!!";
	}

}