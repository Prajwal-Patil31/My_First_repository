package in.utl.noa.model;

import java.util.List;

public interface ResourceProvider {

	// Build Resources with builder: uris, privileges/actions
	// Get Resource/Service Manager for resources
	// Get Resource
	// List Resources
	// Free Resource
	// Get/Set Parent

	String getName();

	List<Resource> listResources();

}
