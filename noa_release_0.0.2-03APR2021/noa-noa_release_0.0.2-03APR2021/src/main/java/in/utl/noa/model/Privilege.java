package in.utl.noa.model;

import java.util.List;

public interface Privilege {

	Resource getResource();

	Boolean parseActions();

	List<String> getActions();
}
