package in.utl.noa.model;

import in.utl.noa.model.Feature;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(collectionResourceRel = "features", path = "features")
public interface FeatureRepository extends JpaRepository<Feature, Integer> {

    public Feature findByFeatureId(int featureId);
    public Feature findByFeatureName(String featureName);
}