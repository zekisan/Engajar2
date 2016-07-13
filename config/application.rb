require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Engajar
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Disable some generators
    config.generators do |g|
      g.stylesheets false
      g.javascripts false
      g.view_specs false
      g.routing_specs false
      g.controller_specs false
      g.request_specs false
      g.helper false
      g.fixture_replacement :machinist
      g.base_cell_class 'ApplicationCell'
    end

    config.webpack = { use_manifest: false, asset_manifest: {}, common_manifest: {} }
  end
end
