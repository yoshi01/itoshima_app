require 'test_helper'

class TouristSpotsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tourist_spot = tourist_spots(:one)
  end

  test "should get index" do
    get tourist_spots_url
    assert_response :success
  end

  test "should get new" do
    get new_tourist_spot_url
    assert_response :success
  end

  test "should create tourist_spot" do
    assert_difference('TouristSpot.count') do
      post tourist_spots_url, params: { tourist_spot: { description: @tourist_spot.description, location: @tourist_spot.location, name: @tourist_spot.name } }
    end

    assert_redirected_to tourist_spot_url(TouristSpot.last)
  end

  test "should show tourist_spot" do
    get tourist_spot_url(@tourist_spot)
    assert_response :success
  end

  test "should get edit" do
    get edit_tourist_spot_url(@tourist_spot)
    assert_response :success
  end

  test "should update tourist_spot" do
    patch tourist_spot_url(@tourist_spot), params: { tourist_spot: { description: @tourist_spot.description, location: @tourist_spot.location, name: @tourist_spot.name } }
    assert_redirected_to tourist_spot_url(@tourist_spot)
  end

  test "should destroy tourist_spot" do
    assert_difference('TouristSpot.count', -1) do
      delete tourist_spot_url(@tourist_spot)
    end

    assert_redirected_to tourist_spots_url
  end
end
