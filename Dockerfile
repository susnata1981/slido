FROM ruby:2.7
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y yarn

ENV RAILS_ENV production
ENV RAILS_SERVE_STATIC_FILES true
ENV RAILS_LOG_TO_STDOUT true
ENV CLOUDFRONT_HOST d1onm49hj91bos.cloudfront.net

RUN mkdir /myapp
WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
RUN bundle install --without development test

#ARG ASSET_HOST
#RUN bundle exec rails ASSET_HOST=${CLOUDFRONT_HOST} assets:precompile
#RAILS_ENV=production assets:precompileRUN RAILS_ENV=production bundle exec rails assets:precompile
RUN bundle exec rails assets:precompile
COPY . /myapp
RUN yarn install --check-files

# Add a script to be executed every time the container starts.
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000
# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
