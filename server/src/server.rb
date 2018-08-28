require 'sequel'
require 'json'
require 'securerandom'
require 'omniauth'
require 'omniauth-steam'
require 'rack'
require 'sinatra'
require 'uri'
require 'http'

use Rack::Session::Cookie
use OmniAuth::Builder do
  provider :steam, 'E56A407B5DADFFD74FD22ABE6AAEAFEF'
end

set :public_folder, File.dirname(__FILE__) + '/../../docs'

DB = Sequel.sqlite(File.dirname(__FILE__) + '/../../db/proton-city.db')

DB.create_table? :entries do
  primary_key :id
  String :description
  String :distro
  String :hardware
  String :game_id
  String :native_version
  String :proton_version # TODO: Replace default
  String :game_version
  String :state
  String :user_steam_id
  DateTime :submission_time
end

DB.create_table? :sessions do
  primary_key :id
  String :steam_id
  String :session_token
end

entries = DB[:entries]
sessions = DB[:sessions]

before do
  content_type :json
end

get '/' do
  redirect to('/index.html')
end

def game_search(term)
  uri_decoded = URI::decode(term)
  url = "https://store.steampowered.com/api/storesearch/?term=#{uri_decoded}"
  json = JSON.parse(HTTP.get(url).to_s)

  json['items'].map do |x|
    {
      game_name: x['name'],
      game_id: x['id'],
      game_image:
        "https://steamcdn-a.akamaihd.net/steam/apps/#{x['id']}/header.jpg",
      store_link:
        "https://store.steampowered.com/app/#{x['id']}/"
    }
  end
end

get '/api/games/search/:term' do
  game_search(params['term']).to_json
end

get '/api/games/search/:term/with_entries' do
  game_search(params['term']).map do |x|
    x.merge({
      entries: (entries.where(game_id: x[:game_id]) || {}).to_a
    })
  end.to_json
end

get '/api/games/:id/entries' do
  begin
    game_id = params['id'].to_i
  rescue
    halt 400, 'ID must be numeric'
  end
  (entries.where(game_id: game_id).all || {}).to_json
end

post '/api/games/:id/entries' do
  halt 401

  json = JSON.parse(request.body.read)

  user_steam_id = nil # TODO: FIND FROM SESSIONS, ACTS AS AUTH TOO

  object = {
    description: json['description'],
    distro: json['distro'],
    hardware: json['hardware'],
    game_id: json['game_id'],
    native_version: json['native_version'],
    proton_version: json['proton_version'],
    game_version: json['game_version'],
    state: json['state'],
    user_steam_id: user_steam_id,
    submission_time: DateTime.now
  }

  # TODO: Check none are nil

  new_id = entries.insert(**object)
  { id: new_id }.to_json
end

post '/api/auth/:name/callback' do
  auth = request.env['omniauth.auth']
  steam_id = auth['steamid']
  session_token = SecureRandom.uuid

  sessions.insert(steam_id: steam_id, session_token: session_token)

  { session_token: session_token }.to_json
end
