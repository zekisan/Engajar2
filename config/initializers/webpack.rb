Engajar::Application.configure do
  if (use_manifest = config.webpack[:use_manifest])
    asset_manifest = Rails.root.join('public/assets/webpack-asset-manifest.json')
    common_manifest = Rails.root.join('public/assets/webpack-common-manifest.json')

    if asset_manifest.exist?
      config.webpack[:asset_manifest] = JSON.parse(asset_manifest.read).with_indifferent_access
    elsif use_manifest == :maybe
      config.webpack[:use_manifest] = false
    end

    if common_manifest.exist?
      config.webpack[:common_manifest] = JSON.parse(common_manifest.read).with_indifferent_access
    elsif use_manifest == :maybe
      config.webpack[:use_manifest] = false
    end
  end
end