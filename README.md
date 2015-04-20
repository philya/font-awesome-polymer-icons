Font Awesome as a Polymer/core-iconset-svg component

# Set Up

    bower install font-awesome-iconset

# Use

Link your custom component alongside with other Polymer dependencies

    <link rel="import" href="bower_components/font-awesome-iconset/fa-icons.html">

Use the iconset

    <core-icon icon="fa:line-chart"></core-icon>

# Update

To update to the latest version of FontAwesome, just install node modules and run "update"

    npm install
    node update

Soon there will be a production script to export only the icons to be used (like the original [font-awesome-polymer-icons-generator](https://github.com/philya/font-awesome-polymer-icons-generator) but in node)