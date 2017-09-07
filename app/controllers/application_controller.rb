class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception


  def hello
    render html: "hello world"
  end

  def after_sign_in_path_for(resource)
    admin_root_path
  end
end
