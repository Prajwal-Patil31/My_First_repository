package in.utl.noa.model;

import java.util.List;

public class DefaultPrivilege implements Privilege {

	Resource resource;

	List<String> actions;

	@Override
	public Resource getResource() {
		return resource;
	}

	public void setResource(Resource resource) {
		this.resource = resource;
	}

	@Override
	public List<String> getActions() {
		return actions;
	}

	@Override
	public Boolean parseActions() {
		return null;
	}
}
