import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  deleteAppoinmetData,
  getAppoinmetData,
  getAppointmentsByDeviceActivityId,
} from '../../Database/AppointmentTable';
import {
  deleteAllActivityData,
  getActivityData,
  getJoinedData,
  getNewActivityByDeviceActivityId,
  initDatabase,
} from '../../Database/NewActivityTable';
import {
  deleteActivityItemData,
  getActivityItemData,
  getActivityItemsByDeviceActivityId,
} from '../../Database/ActivityItemsTable';
import moment from 'moment';
import base64 from 'base-64';
import {
  deleteSpecificationData,
  getSpecificationData,
  getSpecificationDataByDeviceActivityId,
  getSpecificationsByDeviceActivityId,
} from '../../Database/SpecificationTable';
import {Base_Url, PASSWORD, USERNAME} from '../../../variable';
import {
  getTimeTrackerData,
  getTimeTrackerItemsByDeviceActivityId,
  initTimeTrackerDatabase,
  insertTimeTrackerItems,
} from '../../Database/TimeTrackerTable';
import {useToast} from 'react-native-toast-notifications';
import {updateActivitySummaryDraft} from '../../Database/DraftTable';

const ActivitySummary = ({route}) => {
  const navigation = useNavigation();

  const isFocused = useIsFocused();
  const date = moment();
  const toast = useToast();

  const {deviceId} = route.params;

  console.log('device id from activity summary', deviceId);

  // Convert to Bangladeshi time (Asia/Dhaka timezone)
  // const utcDateTime = moment.utc();
  // const bangladeshiDateTime = utcDateTime
  //   .tz('Asia/Dhaka')
  //   .format('YYYY-MM-DDTHH:mm:ss');
  // console.log('this is date time', bangladeshiDateTime);

  // useEffect(() => {
  //   getSpecificationsByDeviceActivityId(DeviceActivityId)
  // }, [])

  // useEffect(() => {
  //   const deviceId = DeviceActivityId;
  //   getNewActivityByDeviceActivityId(deviceId, (newActivityItems) => {
  //     console.log('New Activity Items:', newActivityItems);

  //     // Do something with the retrieved data
  //   });
  // }, [isFocused,DeviceActivityId])

  // useEffect(() => {
  //   getTimeTrackerAllData();
  // }, [isFocused]);

  // const getTimeTrackerAllData = () => {

  //   getTimeTrackerItemsByDeviceActivityId(deviceActivityId, item => {
  //     setTimeTracker(item);
  //   });
  // };

  // initialize database
  useEffect(() => {
    //=== activity ====
    initDatabase();
    // getData();
    // deleteData()

    // === draft ====
    // initDraftDatabase();
    // getDraftallData();

    // ==== Time tracker =====
    initTimeTrackerDatabase();
    // getTimeTrackerAllData();
  }, [isFocused]);

  // ==============
  const [appointmentData, setAppointmentData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [activityItem, setActivityItem] = useState([]);
  const [activitySpecs, setActivitySpecs] = useState([]);
  const [activityTimeTrack, setActivityTimeTrack] = useState([]);

  const [data, setData] = useState();

  // const [timeTracker, setTimeTracker] = useState(null);

  console.log(
    'this is time trackeeeeeeeer data -----------------',
    JSON.stringify(activityTimeTrack, null, 2),
  );

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    // getAppoinmetData(item => setAppointmentData(item));

    getAppointmentsByDeviceActivityId(deviceId, item => {
      setAppointmentData(item);
    });

    // getActivityData(item => setActivityData(item));
    getNewActivityByDeviceActivityId(deviceId, item => {
      setActivityData(item);
    });

    // getActivityItemData(item => setActivityItem(item));
    getActivityItemsByDeviceActivityId(deviceId, item => {
      setActivityItem(item);
    });

    // getSpecificationData(item => setActivitySpecs(item));
    getSpecificationDataByDeviceActivityId(deviceId, item => {
      setActivitySpecs(item);
    });

    getTimeTrackerItemsByDeviceActivityId(deviceId, item => {
      setActivityTimeTrack(item);
    });
  };

  // working code

  // const getData = () => {
  //   getAppoinmetData(item => setAppointmentData(item));
  //   getActivityData(item => setActivityData(item));
  //   getActivityItemData(item => setActivityItem(item));
  //   getSpecificationData(item => setActivitySpecs(item));
  // };

  const appoint = {
    CustomerAppointmentDTOList: appointmentData,
  };

  // console.log(
  //   'this is saved appointment data',
  //   JSON.stringify(appoint, null, 2),
  // );

  const apiResponseData = activityData;

  // console.log("activity data <<<<<<<<<<===",JSON.stringify(apiResponseData[0]?.CustomerName,null,2))

  // Remove square brackets and get the JSON object
  const jsonObject = apiResponseData[0];

  const resultObject = {
    ...jsonObject,
    SalesPersonActivityItemDetailsDTOList: activityItem,
    SalesPersonActivitySpecDetailsDTOList: activitySpecs,
    CustomerAppointmentDTOList: appointmentData,
    SalesPersonActivityTimeDetailsDTOList: activityTimeTrack,
  };

  console.log(
    'Total result 2 ========== ',
    JSON.stringify(resultObject, null, 2),
  );

  // ==================

  const deviceActivityId = deviceId;
  const ActivityTime = date.format('YYYY-MM-DDTHH:mm:ss');
  const EntryBy = resultObject.ActivityBy;
  const EntryDate = date.format('YYYY-MM-DDTHH:mm:ss');

  // my code =====

  // const SubmitTimeTrackerData = async () => {
  //   const currentWorkingStatus = 4;
  //   await insertTimeTrackerItems(
  //     deviceActivityId,
  //     ActivityTime,
  //     // WorkingStatus,
  //     currentWorkingStatus,
  //     EntryBy,
  //     EntryDate,

  //     success => {
  //       if (success) {
  //         // Alert.alert('Time Tracker Data inserted successfully');
  //         toast.show('submit data inserted successfully', {
  //           type: 'success',
  //           duration: 1500,
  //         });

  //       } else {
  //         // Alert.alert('Failed to insert Time Tracker data');
  //         toast.show('Failed to insert submit data', {
  //           type: 'success',
  //           duration: 2000,
  //         });
  //       }
  //     },
  //   );
  // };

  // posting all data to api

  // const handleSubmitData = async () => {

  //   SubmitTimeTrackerData();

  //   // const requestData = resultObject;

  //   // console.log('requuuuuuu', JSON.stringify(requestData, null, 2));

  //   const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);

  //   const response = await fetch(
  //     `${Base_Url}/api/SalesPersonActivityApi/SalesPersonActivityCreateApi`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: authHeader,
  //       },
  //       body: JSON.stringify(resultObject),
  //       // body: requestData,
  //     },
  //   );

  //   const result = await response.text();

  //   // setIsLoader(false); // Stop loading

  //   console.log('this is final result', JSON.stringify(result, null, 2));

  //   if (result === 'Submit done') {
  //     Alert.alert(result);

  //     // navigation.navigate('HomeScreen');

  //     // deleteSpecificationData();
  //     // deleteAllActivityData();
  //     // deleteAppoinmetData();
  //     // deleteActivityItemData();
  //   } else {
  //     Alert.alert('error not submit');
  //   }
  // };

  // ================== my code end =============

  // const handleSubmitData = async () => {
  //   try {
  //     SubmitTimeTrackerData();

  //     getTimeTrackerItemsByDeviceActivityId(deviceId, item => {
  //       setActivityTimeTrack(item);
  //     });

  //     const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);

  //     const response = await fetch(
  //       `${Base_Url}/api/SalesPersonActivityApi/SalesPersonActivityCreateApi`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: authHeader,
  //         },
  //         body: JSON.stringify(resultObject),
  //         // body: requestData,
  //       },
  //     );

  //     const result = await response.text();

  //     // setIsLoader(false); // Stop loading

  //     console.log('this is final result', JSON.stringify(result, null, 2));

  //     if (result === 'Submit done') {
  //       Alert.alert(result);

  //       navigation.navigate('HomeScreen');

  //       // deleteSpecificationData();
  //       // deleteAllActivityData();
  //       // deleteAppoinmetData();
  //       // deleteActivityItemData();
  //     } else {
  //       Alert.alert('error not submit');
  //     }
  //   } catch (error) {
  //     console.error('Error in handleSubmitData:', error);
  //   }
  // };

  // ==============

  useEffect(() => {
    if (data) {
      apicall();
    }
  }, [data]);

  const SubmitTimeTrackerData = async () => {
    const currentWorkingStatus = 4;

    try {
      // Assuming insertTimeTrackerItems accepts a callback
      await insertTimeTrackerItems(
        deviceActivityId,
        ActivityTime,
        currentWorkingStatus,
        EntryBy,
        EntryDate,
        async response => {
          // Use the response to update resultObject
          if (response) {
            // Update time tracking data in resultObject
            await getTimeTrackerItemsByDeviceActivityId(deviceId, item => {
              setActivityTimeTrack(item);

              // Update resultObject with the latest time tracking data
              const updatedResultObject = {
                ...resultObject,
                SalesPersonActivityTimeDetailsDTOList: item,
              };

              console.log(
                'Updated resultObject ========== ',
                JSON.stringify(updatedResultObject, null, 2),
              );

              setData(updatedResultObject);
            });
          }
        },
      );
    } catch (error) {
      console.error('Failed to insert submit data', error);
      toast.show('Failed to insert submit data', {
        type: 'error',
        duration: 2000,
      });
    }

    return null;
  };

  const handleSubmitData = async () => {
    try {
      // await getData();

      await SubmitTimeTrackerData();

      console.log('Total result 2 ========== ', JSON.stringify(data, null, 2));

      // await apicall();
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error: Submission failed');
    }
  };

  const apicall = async () => {
    const authHeader = 'Basic ' + base64.encode(USERNAME + ':' + PASSWORD);
    const response = await fetch(
      `${Base_Url}/api/SalesPersonActivityApi/SalesPersonActivityCreateApi`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(data),
      },
    );

    const apiResponse = await response.text();

    console.log('API Response:', JSON.stringify(apiResponse, null, 2));

    if (apiResponse === 'Submit done') {
      Alert.alert(apiResponse);
      navigation.navigate('HomeScreen');

      // extra

      // Call updateActivityDraft on success

      const currentWorkingStatus = 4;

      updateActivitySummaryDraft(
        deviceActivityId,
        currentWorkingStatus,
        draftUpdateSuccess => {
          // Callback for updateActivityDraft
          if (draftUpdateSuccess) {
            // updateActivityDraft succeeded

            console.log('Draft updated successfully');

            // toast.show('Draft updated successfully', {
            //   type: 'success',
            //   duration: 2000,
            // });

            // navigation.goBack();
          } else {
            // updateActivityDraft failed
            // console.log('Failed to update draft');
            toast.show('Failed to update draft', {
              type: 'success',
              duration: 2000,
            });
            // Handle failure case for updateActivityDraft
          }

          // navigation.goBack();

          getData();
        },
      );

      // ===
    } else {
      Alert.alert('Error: Submission failed');
    }
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: '#FFFFFF'}}>
      <ScrollView>
        {/* ====== main header ====== */}
        {/* <View style={{alignSelf: 'center', marginVertical: 10}}>
          <Text style={{color: '#000000', fontSize: 20, fontWeight: '700'}}>
            Activity Summary
          </Text>
        </View> */}

        {/* first section */}
        <View style={styles.first_container}>
          <View style={{marginBottom: 10}}>
            <Text style={[styles.first_header_text, {fontWeight: '700'}]}>
              Activity No: {resultObject.DeviceActivityId}
            </Text>
          </View>
          <Text style={styles.first_header_text}>
            Date:{' '}
            {moment(resultObject.DeviceSystemDateTime).format('DD MMM YYYY')}
          </Text>
          <Text style={styles.first_header_text}>
            Customer Name: {''}
            {/* {resultObject.CustomerName} */}
            {resultObject?.CustomerType === 'Default'
              ? 'Default'
              : resultObject?.CustomerName}
          </Text>

          {/* <Text style={styles.first_header_text}>
            Customer Address: {resultObject.CustomerAddress}
          </Text> */}

          {/* <Text style={styles.first_header_text}>
            Sales Person: Ariyan Arif
          </Text> */}
        </View>

        {/*========= Items details ==============*/}
        <View style={styles.order_container}>
          {/* <View style={{alignSelf: 'flex-start'}}>
            <Text style={{fontSize: 20, fontWeight: '700', color: '#6C6D6D'}}>
              Item Details
            </Text>
          </View> */}

          {resultObject.SalesPersonActivityItemDetailsDTOList.length > 0 && (
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{fontSize: 17, fontWeight: '700', color: '#6C6D6D'}}>
                Item Details
              </Text>
            </View>
          )}

          {/* ========================= Table section =========================== */}

          <View style={styles.wrapper}>
            {/* table container */}
            <View style={styles.table}>
              {/* <View style={styles.table_head}>
               
                <View style={{width: '25%'}}>
                  <Text style={styles.table_captions}>Barcode</Text>
                </View>
                <View style={{width: '25%'}}>
                  <Text style={styles.table_captions}>Qty</Text>
                </View>
                <View style={{width: '25%'}}>
                  <Text style={styles.table_captions}>Sample</Text>
                </View>
                <View style={{width: '25%'}}>
                  <Text style={styles.table_captions}>Remarks</Text>
                </View>
              </View>


              {resultObject.SalesPersonActivityItemDetailsDTOList.map(
                (item, index) => (
                  <View style={styles.table_body}>
                    
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.Barcode}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.ItemQty}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.IsSample}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.Remarks}</Text>
                    </View>
                  </View>
                ),
              )} */}

              {resultObject.SalesPersonActivityItemDetailsDTOList.length >
                0 && (
                /*========== table head ===========*/
                <View style={styles.table_head}>
                  {/* one single row */}
                  <View style={{width: '35%'}}>
                    <Text style={styles.table_captions}>Barcode</Text>
                  </View>
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_captions}>Qty</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_captions}>Sample</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_captions}>Remarks</Text>
                  </View>
                </View>
              )}

              {/*========== table body ==========*/}

              {resultObject.SalesPersonActivityItemDetailsDTOList.map(
                (item, index) => (
                  <View style={styles.table_body}>
                    {/* one single row */}
                    <View style={{width: '35%'}}>
                      <Text style={styles.table_data}>{item.Barcode}</Text>
                    </View>
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>{item.ItemQty}</Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>
                        {item.IsSample === 1 ? 'True' : 'False'}
                      </Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>{item.Remarks}</Text>
                    </View>
                  </View>
                ),
              )}
            </View>
          </View>
        </View>

        {/*=========== Specification Details ==============*/}

        <View style={styles.order_container}>
          {resultObject.SalesPersonActivitySpecDetailsDTOList.length > 0 && (
            <View style={{alignSelf: 'flex-start'}}>
              <Text style={{fontSize: 17, fontWeight: '700', color: '#6C6D6D'}}>
                Spec Details
              </Text>
            </View>
          )}

          {/* ========================= Table section =========================== */}

          <View style={styles.wrapper}>
            {/* table container */}
            <View style={styles.table}>
              {/*========== table head ===========*/}

              {resultObject.SalesPersonActivitySpecDetailsDTOList.length >
                0 && (
                <View style={styles.table_head}>
                  {/* one single row */}
                  <View style={{width: '35%'}}>
                    <Text style={styles.table_captions}>Name</Text>
                  </View>
                  <View style={{width: '15%'}}>
                    <Text style={styles.table_captions}>Qty</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_captions}>Measurement</Text>
                  </View>
                  <View style={{width: '25%'}}>
                    <Text style={styles.table_captions}>Remarks</Text>
                  </View>
                </View>
              )}

              {/*========== table body ==========*/}

              {resultObject.SalesPersonActivitySpecDetailsDTOList.map(
                (specDetail, index) => (
                  <View style={styles.table_body}>
                    {/* one single row */}
                    <View style={{width: '35%'}}>
                      <Text style={styles.table_data}> {specDetail.Name}</Text>
                    </View>
                    <View style={{width: '15%'}}>
                      <Text style={styles.table_data}>
                        {specDetail.SpecQty}
                      </Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>
                        {specDetail.Measurement}
                      </Text>
                    </View>
                    <View style={{width: '25%'}}>
                      <Text style={styles.table_data}>
                        {specDetail.Remarks}
                      </Text>
                    </View>
                  </View>
                ),
              )}
            </View>
          </View>
        </View>

        {/* ====== Appointment section ========= */}

        {/* <View style={styles.first_container}>
          {resultObject.CustomerAppointmentDTOList.map((cusApp, index) => (
            <View key={index} style={{marginBottom: 10}}>
              <View style={{marginBottom: 5}}>
                <Text style={[styles.first_header_text, {fontWeight: '700'}]}>
                  Appoinment No: {index + 1}
                </Text>
              </View>
              <Text style={styles.first_header_text}>
                Customer Address: {cusApp.Address}
              </Text>
              <Text style={styles.first_header_text}>
                Purpose: {cusApp.Purpose}
              </Text>
              <Text style={styles.first_header_text}>
                Appointment Date: {''}
                {moment(cusApp.AppointmentDate).format('DD MMM YYYY')}
              </Text>

              <Text style={styles.first_header_text}>
                Appointment Time: {''}
                {moment(cusApp.AppointmentDate).format('hh:mm A')}
              </Text>
            </View>
          ))}
        </View> */}

        <View style={{marginBottom: 10}}>
          {resultObject.CustomerAppointmentDTOList.map((cusApp, index) => (
            <View style={styles.first_container}>
              <View key={index}>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.first_header_text, {fontWeight: '700'}]}>
                    {/* Appoinment No: {cusApp.CustomerId} */}
                    Appointment No: {index + 1}
                  </Text>
                </View>
                <Text style={styles.first_header_text}>
                  Customer Address: {cusApp.Address}
                </Text>
                <Text style={styles.first_header_text}>
                  Purpose: {cusApp.Purpose}
                </Text>
                <Text style={styles.first_header_text}>
                  Appointment Date:{' '}
                  {moment(cusApp.AppointmentDate).format('DD MMM YYYY')}
                </Text>
                <Text style={styles.first_header_text}>
                  Appointment Time:
                  {/* {cusApp.AppointmentTime} */}
                  {moment(cusApp.AppointmentTime, 'HH:mm:ss').format('hh:mm A')}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/*======== button ========*/}

      <View style={{alignSelf: 'center', marginVertical: 10}}>
        <TouchableOpacity style={styles.button} onPress={handleSubmitData}>
          <Text style={{color: '#ffffff', fontWeight: '700', fontSize: 22}}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={{alignSelf: 'center', marginVertical: 30}}>
          <TouchableOpacity style={styles.button} onPress={apicall}>
            <Text style={{color: '#ffffff', fontWeight: '700', fontSize: 22}}>
              Submit
            </Text>
          </TouchableOpacity>
        </View> */}
    </View>
  );
};

export default ActivitySummary;

const styles = StyleSheet.create({
  first_container: {
    // height:250,
    // backgroundColor: '#e9ecef', // f8f9fa e9ecef
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(242, 242, 242, 0.7)',
    // elevation:5
  },
  order_container: {
    marginVertical: 10,
    // elevation:5
  },

  item_container: {
    marginBottom: 100,
    flex: 1,
  },

  // fist section
  first_header_text: {
    fontSize: 15,
    // fontWeight: '600',
    color: '#000000',
  },

  // ============ Table design =============
  wrapper: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  table: {
    // margin: 15,
    marginTop: 10,
    // marginHorizontal: 5,
    // borderWidth: 1,
    borderColor: '#ced4da',
    // borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,

    // elevation: 2,
  },
  table_head: {
    flexDirection: 'row',
    // backgroundColor: '#BFE7F0',
    borderColor: '#ced4da',
    backgroundColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#adb5bd',

    borderTopWidth: 1,
  },
  table_captions: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',

    borderRightWidth: 1,
    borderRightColor: '#ced4da',
    // borderRightColor: '#000000',
    padding: 5,

    flex: 1,
    fontSize: 12,
  },

  table_body: {
    flexDirection: 'row',
    // backgroundColor: '#E2F6F8',

    // backgroundColor: '#e9ecef',
    backgroundColor: 'rgba(242, 242, 242, 0.7)',

    // padding: 10,

    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  table_data: {
    color: '#000000',
    fontSize: 12,
    textAlign: 'center',

    borderRightWidth: 1,
    borderRightColor: '#ced4da',
    padding: 5,

    flex: 1,
    // flexWrap:"wrap"
  },

  button: {
    // borderWidth:1,
    width: '100%',
    // alignSelf: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#2FD790',
    elevation: 5,
    // flex:1,
  },

  //   ===================

  tableInput: {
    textAlign: 'center',
    // borderRightWidth: 1,
    padding: 0,
    color: 'black',
    // borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    margin: 2,
    height: 20,
    borderRadius: 15,
  },
});
