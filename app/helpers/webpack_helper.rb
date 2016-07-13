module WebpackHelper
  def webpack_bundle_tag(*bundles)
    asset_host = compute_asset_host
    manifest = wp_config[:use_manifest] && wp_config[:asset_manifest]

    files = bundles.flat_map do |bundle|
      if manifest
        Array.wrap(manifest[bundle]).reject { |f| /[.]map$/ === f }
      else
        bundle
      end
    end.map { |f| "#{asset_host}/assets/#{f}" }

    javascript_include_tag *files
  end

  def webpack_manifest_script
    javascript_tag "window.webpackManifest = #{wp_config[:common_manifest].to_json}" if wp_config[:use_manifest]
  end

  private

  def wp_config
    Rails.configuration.webpack
  end
end