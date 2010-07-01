require 'osc'
require 'thread'
require 'json'
require 'queue'

class OSCManager

  def initialize
    @host = 'localhost'
    @port = 9999
    @queues = {}

    @server = OSC::UDPServer.new
    @server.bind(@host, @port)
    @server.add_method('/*', nil) do |osc|
      begin
        # p osc
        broadcast([osc])
      rescue 
        puts $!.message
        puts $!.backtrace
      end
    end

    Thread.new do
      @server.serve
    end
  end

  def broadcast(messages, sender_id = nil)
    @queues.each do |client_id, queue|
      unless client_id == sender_id
        queue.push(messages)
      end
    end
  end
  
  def call(env)
    client_id = env['PATH_INFO'][1..-1]
    queue = @queues[client_id]

    if queue.nil?
      queue = @queues[client_id] = TQueue.new
      messages = $manager.constructor_messages.map { |message| message.json_message }
    else
      messages = queue.wait.map {|osc| [osc.address, osc.args] }
    end

    [200, {'Content-Type' => 'text/javascript'}, messages.to_json]
  end
end
  