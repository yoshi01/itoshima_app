module Admin
  class TouristSpotsController < Admin::ApplicationController
    # To customize the behavior of this controller,
    # you can overwrite any of the RESTful actions. For example:
    #
    # def index
    #   super
    #   @resources = TouristSpot.
    #     page(params[:page]).
    #     per(10)
    # end
    before_action :default_params

    def default_params
      params[:order] ||= 'id'
      params[:direction] ||= 'desc'
    end

    # Define a custom finder by overriding the `find_resource` method:
    # def find_resource(param)
    #   TouristSpot.find_by!(slug: param)
    # end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
  end
end
