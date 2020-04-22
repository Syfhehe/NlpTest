package sample;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import sample.model.FileProperties;

@SpringBootApplication
@EnableConfigurationProperties({ FileProperties.class })
@EntityScan(value = "sample.model")
public class WebApplication {

	public static void main(String[] args) throws Exception {
		new SpringApplicationBuilder(WebApplication.class).run(args);
	}

}
