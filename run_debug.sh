export GOOGLE_APPLICATION_CREDENTIALS="/c/AFXReceiptOrganizer.json"
export JAVA_OPTS="-XX:+TieredCompilation -XX:+UseCompressedOops -Dprogram.name=standalone.sh -Xms2048M -Xmx2048M -XX:MaxPermSize=256M -Djava.net.preferIPv4Stack=true -Djboss.modules.system.pkgs=org.jboss.byteman -agentlib:jdwp=transport=dt_socket,server=y,suspend=n"
sh ~/Documents/jboss-eap-7.0/bin/standalone.sh --debug