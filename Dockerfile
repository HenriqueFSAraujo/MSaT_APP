FROM node:18.19.0 AS build


# Set the working directory
WORKDIR /usr/local/app

# Add the source code to app
COPY ./ /usr/local/app/

# Install all the dependencies
RUN npm cache clean --force
RUN rm -rf node_modules
RUN npm install --legacy-peer-deps
RUN npm install -g @angular/cli@~16.1.1 --save-dev --force
 

# Generate build of the applicatin argument

ARG argname

RUN if [ "$argname" = "dev" ] ; then \
        npm run build-developer ; \
    fi

RUN if [ "$argname" = "homolog" ] ; then \
        npm run build-homolog ; \
    fi

RUN if [ "$argname" = "prd" ] ; then \
        npm run build-prod ; \
    fi

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
COPY --from=build /usr/local/app/dist/montreal-garantias/. /usr/share/nginx/html/
#COPY ./conf/nginx-custom.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80