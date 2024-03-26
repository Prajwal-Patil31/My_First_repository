package in.utl.noa.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "features", path = "features")
public interface FeatureRepository extends JpaRepository<Feature, Integer> {

    public Feature findByFeatureId(int featureId);
    public Feature findByFeatureName(String featureName);
}