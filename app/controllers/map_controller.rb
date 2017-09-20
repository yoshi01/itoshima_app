class MapController < ApplicationController
  def index
    start_id = params[:start_id]
    end_id = params[:end_id]
    @tourist_spots = TouristSpot.all
    @start_spot = TouristSpot.find(start_id) if start_id.present?
    @end_spot = TouristSpot.find(end_id) if end_id.present?
    @hash = Gmaps4rails.build_markers(@tourist_spots) do |tourist_spot, marker|
      marker.lat tourist_spot.latitude
      marker.lng tourist_spot.longitude
      marker.infowindow render_to_string( partial: "map/infowindow",
                                          locals: { tourist_spot: tourist_spot,
                                                    start_id: start_id,
                                                    end_id: end_id }
                                        )
    end
  end
end
