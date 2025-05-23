package com.gestaoprodutos.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.service.OpenAPIService;

@Configuration
public class SpringDocConfig implements BeanFactoryAware {

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        beanFactory.getBean(OpenAPIService.class);
    }
}