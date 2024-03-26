package in.utl.noa.model;

public interface Account {

    public String getCode();

	public void setCode(String code);
    
    public String getName();

	public void setName(String name);

	public Role getRole();

    public void setRole(final Role role);
}
