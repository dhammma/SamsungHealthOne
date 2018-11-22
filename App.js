import React, { Component } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import SamsungHealth from 'rn-samsung-health';
import get from 'lodash/get';

export default class App extends Component {
  state = {
    steps: null,
    stepsError: null,
    connected: false,
    connectionResult: 'Not connected',
  }

  readSteps = () => {
    SamsungHealth.getDailyStepCount({}, (error, result) => {
      if (error) {
        this.setState({
          stepsError: error,
        });
      } else {
        this.setState({
          // -1 if no data
          steps: get(result, '0.data.0.steps', -1),
          stepsError: null,
        });
      }
    });
  }

  handleConnect = () => {
    SamsungHealth.authorize((error, result) => {
      if (error) {
        this.setState({
          connected: false,
          connectionResult: `Connection error: ${error}`,
        });
      } else {
        this.setState({
          connected: true,
          connectionResult: 'Connected successfully',
        });
        this.readSteps();
      }
    });
  }

  handleDisconnect = () => {
    SamsungHealth.stop();
    this.setState({
      connected: false,
      connectionResult: 'Disconnected',
    });
  }

  render() {
    const { connected, connectionResult, steps, stepsError } = this.state;

    return (
      <View style={styles.container}>
        {(steps === 0 || steps) &&
          <Text style={styles.steps}>
            {steps}
          </Text>
        }
        {stepsError &&
          <Text style={styles.stepsError}>
            {stepsError}
          </Text>
        }
        <Text style={styles.connectionStatusText}>
          {connectionResult}
        </Text>
        {!connected &&
          <View style={styles.button}>
            <Button 
              title="Connect Samsung Health"
              onPress={this.handleConnect}
            />
          </View>
        }
        {connected &&
          <View style={styles.button}>
            <Button
              title="Disconnect"
              onPress={this.handleDisconnect}
              style={styles.button}
            />
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    margin: 10,
  },
  connectionStatusText: {
    margin: 10,
  },
  steps: {
    margin: 50,
    fontSize: 30,
    fontWeight: 'bold',
  }
});
