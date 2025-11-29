#!/usr/bin/env ruby

# Script para desabilitar completamente a fase VerifyModule no projeto Xcode
# Este script modifica o projeto .xcodeproj diretamente

require 'xcodeproj'

project_path = File.join(__dir__, '..', 'ios', 'App', 'App.xcodeproj')
project = Xcodeproj::Project.open(project_path)

puts "🔧 Desabilitando fase VerifyModule..."

project.targets.each do |target|
  target.build_phases.each do |phase|
    if phase.respond_to?(:name) && phase.name == 'VerifyModule'
      puts "  ❌ Removendo VerifyModule de: #{target.name}"
      phase.remove_from_project
    end
  end
  
  # Também desabilita via build settings
  target.build_configurations.each do |config|
    config.build_settings['ENABLE_MODULE_VERIFIER'] = 'NO'
    config.build_settings['CLANG_VERIFY_MODULE'] = 'NO'
  end
end

project.save
puts "✅ Projeto atualizado!"

