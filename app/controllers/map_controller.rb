class MapController < ApplicationController
  def index
    ajax_action unless params[:ajax_handler].blank?
    @tourist_spots = TouristSpot.all
    @courses = Course.all
    @hash = Gmaps4rails.build_markers(@tourist_spots) do |tourist_spot, marker|
      marker.lat tourist_spot.latitude
      marker.lng tourist_spot.longitude
      marker.infowindow render_to_string( partial: "map/infowindow",
                                          locals: { tourist_spot: tourist_spot}
                                        )
      marker.picture({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        width: 32,
        height: 32
      });
      marker.json({ id: tourist_spot.id })
    end
  end

  def ajax_action
    if params[:ajax_handler] == "selectbox-ajax"
      @course_spots = CourseRelationship.where(course_id: params[:course_id]).order(:spot_order)
      render json: @course_spots.to_json({include: :tourist_spot})
    end
  end
end
