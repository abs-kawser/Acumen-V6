import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import customStyle from '../../Styles/commonStyle';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {CustomerContext} from '../../Context/CustomerProvider';
import {
  getNewActivityByDeviceActivityId,
  updateActivityNote,
} from '../../Database/NewActivityTable';
import {useToast} from 'react-native-toast-notifications';

import moment from 'moment';



const Notes = ({route}) => {
  
  const navigation = useNavigation();
  const {devID} = route.params;
  const toast = useToast();
  const isFocused = useIsFocused();

  // const date = moment();
  const [activityData, setActivityData] = useState([]);
  const [note, setNote] = useState('');

  // const { note = activityData.length > 0 ? activityData[0].Notes : "",setNote,} = useContext(CustomerContext);

  console.log(
    'Updateddddddddd activity data from NOTE SCREEN',
    JSON.stringify(activityData, null, 2),
  );

  useEffect(() => {
    getData();
  }, [isFocused]);

  const updateNoteForActivity = () => {
    if (!note) {
      Alert.alert('please insert note');
    } else {
      updateActivityNote(devID, note, success => {
        if (success) {
          toast.show('Note updated successfully', {
            type: 'success',
            duration: 2000,
          });
          navigation.goBack();
          // getData();
        } else {
          toast.show('Failed to update note', {
            type: 'danger',
            duration: 2000,
          });
        }
      });
    };
  };

  const getData = () => {
    // getActivityData(item => setActivityData(item));
    // getNewActivityByDeviceActivityId(devID, (item) => { setActivityData(item) })
    getNewActivityByDeviceActivityId(devID, item => {
      if (item && item.length > 0) {
        setActivityData(item);
        // console.log('updated notessssssssss', item[0].Notes);+
        if (item.length > 0) {
          setNote(item[0].Notes);
        }
      }
    });
  };


  return (

    <View style={customStyle.container}>
      <ScrollView>
        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <Text style={{color: '#000000', fontSize: 20}}>
            {/* Activity No: {deviceActivityId} */}
            Activity No: {devID}
          </Text>
        </View>
        {/* date time */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View>
            <Text style={{fontWeight: '800', color: 'black'}}>
              <Text style={{fontWeight: '800', color: 'black'}}>Date: </Text>
              {moment(activityData[0]?.ActivityStartTime).format('DD MMM YYYY')}
            </Text>
          </View>
          <View>
            <Text style={{color: 'black', fontWeight: '800'}}>
              <Text style={{fontWeight: '800', color: 'black'}}>Time:</Text>{' '}
              {moment(activityData[0]?.ActivityStartTime).format('hh:mm A')}
            </Text>
          </View>
        </View>
        {/* customer name mobile */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          <View>
            <Text style={{fontWeight: '600', color: 'black'}}>
              {' '}
              <Text style={{fontWeight: '800', color: 'black', fontSize: 15}}>
                Customer:
              </Text>{' '}
              {/* {activityData[0]?.CustomerName} */}
              {activityData[0]?.CustomerType === 'Default'
                ? 'Default'
                : activityData[0]?.CustomerName}
            </Text>
          </View>
          {/* <View>
          <Text style={{fontWeight: '600', color: 'black'}}>
            <Text style={{fontWeight: '800', color: 'black', fontSize: 15}}>
              Mobile:
            </Text>{' '}
            {activityData[0]?.CustomerMobile}
          </Text>
        </View> */}
        </View>
        {/* notes input box */}
        <View>
          <Text style={styles.label}>Notes </Text>
          <View style={{flex: 1}}>
            <TextInput
              multiline
              numberOfLines={4}
              style={[styles.input]}
              placeholder="Write notes here"
              placeholderTextColor="gray"
              onChangeText={text => setNote(text)}
              value={note}
              // value={activityData.length > 0 ? activityData[0].Notes : ''}
            />
          </View>
        </View>
      </ScrollView>

      {/* button */}
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          flexDirection: 'row',
          // marginTop: 10,
          marginBottom: 50,
          gap: 20,
        }}>

        <TouchableOpacity
          style={{
            backgroundColor: '#F7D2D2AB',
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 50,
            borderColor: 'red',
            borderWidth: 1,
          }}
          onPress={() => navigation.goBack()}>
          <Text style={{color: 'red', fontWeight: '700'}}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#04C1AA30',
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 50,
            borderColor: '#04C1AA',
            borderWidth: 1,
          }}
          // onPress={() => handleSaveButtonClick()}
          onPress={() => updateNoteForActivity()}
          // onPress={() =>
          //   navigation.navigate('All Activity', {note: notes})
          // }
        >
          <Text style={{color:'#04C1AA', fontWeight: '700',}}>Save & Next</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default Notes;



const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
    // fontFamily: 'Jost-Regular',
    marginTop: 25,
    fontWeight: '900',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#0B87AC',
    borderRadius: 5,
    // marginTop: 20,
    paddingHorizontal: 15,
    color: 'gray',

    paddingLeft: 10,
    // flex: 1,
  },
});
