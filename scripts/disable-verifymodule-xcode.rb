#!/usr/bin/env ruby

# Script para desabilitar completamente a fase VerifyModule no projeto Xcode
# Executa após pod install

require 'xcodeproj'

project_path = File.join(__dir__, '..', 'ios', 'App', 'Pods', 'Pods.xcodeproj')

unless File.exist?(project_path)
  puts "❌ Projeto Pods não encontrado em: #{project_path}"
  puts "   Execute 'pod install' primeiro!"
  exit 1
end

puts "🔧 Desabilitando fase VerifyModule no projeto Pods..."

project = Xcodeproj::Project.open(project_path)

removed_count = 0

project.targets.each do |target|
  target.build_phases.each do |phase|
    # Verifica se é uma fase VerifyModule
    if phase.respond_to?(:name) && phase.name && phase.name.include?('VerifyModule')
      puts "  ❌ Removendo fase '#{phase.name}' de: #{target.name}"
      phase.remove_from_project
      removed_count += 1
    elsif phase.is_a?(Xcodeproj::Project::Object::PBXShellScriptBuildPhase)
      # Verifica scripts que executam VerifyModule
      if phase.shell_script && phase.shell_script.include?('VerifyModule')
        puts "  ❌ Desabilitando script VerifyModule de: #{target.name}"
        phase.shell_script = "# Disabled VerifyModule\n# #{phase.shell_script}"
        removed_count += 1
      end
    end
  end
  
  # Também desabilita via build settings
  target.build_configurations.each do |config|
    config.build_settings['ENABLE_MODULE_VERIFIER'] = 'NO'
    config.build_settings['CLANG_VERIFY_MODULE'] = 'NO'
    config.build_settings['CLANG_MODULE_BUILD'] = 'NO'
  end
end

project.save

if removed_count > 0
  puts "✅ #{removed_count} fase(s) VerifyModule removida(s)/desabilitada(s)!"
else
  puts "⚠️  Nenhuma fase VerifyModule encontrada (pode já ter sido removida)"
end

puts "✅ Projeto atualizado!"

