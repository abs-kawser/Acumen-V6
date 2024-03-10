import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Button,
  Image,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import customStyle from '../../Styles/commonStyle';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../Context/AuthContext';
import moment from 'moment';
import {
  deleteUser,
  getActivityData,
  getNewActivityByDeviceActivityId,
  initDatabase,
  insertNewActivity,
} from '../../Database/NewActivityTable';
import {CustomerContext} from '../../Context/CustomerProvider';
import {
  getDraftData,
  initDraftDatabase,
  insertDraftItems,
} from '../../Database/DraftTable';
import {
  getTimeTrackerData,
  getTimeTrackerItemsByDeviceActivityId,
  initTimeTrackerDatabase,
  insertTimeTrackerItems,
} from '../../Database/TimeTrackerTable';
import {useToast} from 'react-native-toast-notifications';
import ActivitySummary from './ActivitySummary';
import {
  getAppoinmetData,
  getAppointmentsByDeviceActivityId,
} from '../../Database/AppointmentTable';
import {getActivityItemsByDeviceActivityId} from '../../Database/ActivityItemsTable';
import {getSpecificationDataByDeviceActivityId} from '../../Database/SpecificationTable';

const AllActivity = ({route}) => {
  const {data} = route.params;
  const toast = useToast();
  const {value, note} = route.params;

  const {deviceId, ActivityID} = route.params;

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const date = moment();
  const time = date.format('YYYY-MM-DDTHH:mm:ss');

  const ActivityTime = date.format('YYYY-MM-DDTHH:mm:ss');

  const currentDate = date.format('YYYY-MM-DDTHH:mm:ss');

  // Context api
  const {isLoggedIn, setIsLoggedIn} = useContext(AuthContext);
  const {login, userDetails} = isLoggedIn;

  const {
    selectedCustomerType,
    setSelectedCustomerType,
    selectedCustomer,
    setSelectedCustomer,
  } = useContext(CustomerContext);

  console.log(
    'this is customer type from context api',
    JSON.stringify(selectedCustomer, null, 2),
  );

  // hooks

  const [deviceActivityId, setDeviceActivityId] = useState(
    value ? value.DeviceActivityId : devID,
  );

  const [activityData, setActivityData] = useState(null);

  console.log(
    'this is activity data ===== --',
    JSON.stringify(activityData, null, 2),
  );



  // const localDateTime = date.format('MM/DD/YYYY hh:mm:ss');

  const utcDateTime = moment.utc();
  const bdDateTime = utcDateTime.tz('Asia/Dhaka').format('YYYY-MM-DDTHH:mm:ss');

  const [draftData, setDraftData] = useState(null);
  const [timeTracker, setTimeTracker] = useState(null);
  const [ActivityStartTime, setActivityStartTime] = useState(null);

  useEffect(() => {
    setActivityStartTime(bdDateTime);
  }, []);

  // working ==========

  // const ActivityBy = userDetails?.empId;
  // const DeviceActivityID = deviceActivityId;
  // const DeviceSystemDateTime = bdDateTime;
  // const CustomerId =
  //   selectedCustomerType === 'Default'
  //     ? selectedCustomerType
  //     : selectedCustomer.value;

  // const Notes = note;
  // // const WorkingStatus = value ? 2 : 1;
  // const EntryBy = userDetails?.empId;
  // const EntryDate = currentDate;

  // const CustomerName = selectedCustomer ? selectedCustomer.label : '';
  // const CustomerMobile = selectedCustomer ? selectedCustomer.number : '';

  useEffect(() => {
    //=== activity ====
    initDatabase();
    getData();
    // deleteData()

    // === draft ====
    initDraftDatabase();
    getDraftallData();

    // ==== Time tracker =====
    initTimeTrackerDatabase();
    getTimeTrackerAllData();
  }, [isFocused]);

  // const getData = () => {
  //   if (value) {
  //     setDeviceActivityId(value.DeviceActivityId);

  //     // setName(value.CustomerName)
  //   } else {
  //     // getNewActivityByDeviceActivityId(deviceId, item => {
  //       getNewActivityByDeviceActivityId(deviceId, item => {
  //       if (item && item.length > 0) {
  //         setActivityData(item);

  //         setDeviceActivityId(item[0].DeviceActivityId);

  //         // setActivityBy(item[0].ActivityBy)
  //         // setSystemDateTime(item[0].DeviceSystemDateTime)
  //         // setCustomer(item[0].CustomerId)
  //         // setNote(item[0].Notes)
  //         // setEntryBy(item[0].ActivityBy)
  //         // setEntryDate(item[0].DeviceSystemDateTime)

  //         // // setName(item[0].CustomerName)
  //         // setMobile(item[0].CustomerMobile)
  //       }
  //     });
  //   }
  // };

  // ============= from draft ============

  const getData = () => {
    // getActivityData(item => setActivityData(item));
    // getNewActivityByDeviceActivityId(devID, (item) => { setActivityData(item) })

    getNewActivityByDeviceActivityId(
      value ? value.DeviceActivityId : deviceId,
      item => {
        if (item && item.length > 0) {
          setActivityData(item);
          setDeviceActivityId(item[0].DeviceActivityId);
        }
      },
    );
  };

  const draftActivity = value?.ActivityBy;

  // const draftDeviceActvityID = value ?.DeviceActivityId ;

  const draftDateTime = value?.DeviceSystemDateTime;
  const draftCustomer_id = value?.CustomerId;

  const draftActivityNote = value?.Notes;

  const draftActivityEntry = value?.ActivityBy;
  const draftActivityEntryDate = value?.DeviceSystemDateTime;

  const draftCustomerName = value?.CustomerName;
  const draftCustomerMobile = value?.CustomerMobile;
  const draftCustomerType = value?.CustomerType;
  const draftWorkingStatus = value?.WorkingStatus;

  //=============== from activity database============

  const Activity = activityData ? activityData[0].ActivityBy : draftActivity;
  const devID = activityData ? activityData[0].DeviceActivityId : '';

  // const devID = activityData ? activityData[0].DeviceActivityId : draftDeviceActvityID;

  const dateTime = activityData
    ? activityData[0].DeviceSystemDateTime
    : draftDateTime;
  const customer_id = activityData
    ? activityData[0].CustomerId
    : draftCustomer_id;
  const activityNote = activityData ? activityData[0].Notes : draftActivityNote;

  const activityEntry = activityData
    ? activityData[0].ActivityBy
    : draftActivityEntry;
  const activityEntryDate = activityData
    ? activityData[0].DeviceSystemDateTime
    : '';

  const activityCustomerName = activityData
    ? activityData[0].CustomerName
    : draftCustomerName;

  const activityCustomerMobile = activityData
    ? activityData[0].CustomerMobile
    : draftCustomerMobile;

  const activityCustomerType = activityData
    ? activityData[0].CustomerType
    : draftCustomerType;

  const activityWorkingStatus = activityData
    ? activityData[0].WorkingStatus
    : draftWorkingStatus;

  // pass this data into database

  const ActivityBy = Activity;
  const DeviceActivityID = deviceActivityId;
  const DeviceSystemDateTime = dateTime;
  const CustomerId = customer_id;
  const Notes = activityNote;

  const EntryBy = activityEntry;
  const EntryDate = currentDate;

  const CustomerName = activityCustomerName;

  // const CustomerName = name;
  const CustomerMobile = activityCustomerMobile;
  const CustomerType = activityCustomerType;

  const WorkingStatus = activityWorkingStatus;

  // const [hello, setHello] = useState(value ? value.CustomerName : activityCustomerName);

  // console.log("this is HeLLO ======",hello) activityCustomerType
  console.log('this is devID from databse ======', devID);

  // console.log('this is all activity data', JSON.stringify(value, null, 2));

  // for activity
  // const saveData = async () => {
  //   try {
  //     const date = moment();
  //     const ActivityEndTime = date.format('YYYY-MM-DDTHH:mm:ss');
  //     // Call insertNewActivity with the correct value
  //     await insertNewActivity(
  //       ActivityBy,
  //       DeviceActivityID,
  //       DeviceSystemDateTime,
  //       CustomerId,
  //       Notes,
  //       ActivityStartTime,
  //       ActivityEndTime,

  //       CustomerName,
  //       CustomerAddress,
  //       success => {
  //         if (success) {
  //           // Alert.alert('Data inserted successfully');
  //           toast.show('Data inserted successfully', {
  //             type: 'success',
  //             duration: 2000,
  //           });
  //           getData();
  //           navigation.navigate('Activity Summary', {
  //             deviceId: value ? value.DeviceActivityId : deviceActivityId,
  //           });

  //           saveTimeTrackerData(time);
  //         } else {
  //           // Alert.alert('Failed to insert data');
  //           toast.show('Failed to insert data', {
  //             type: 'danger',
  //             duration: 2000,
  //           });
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     console.error('Error saving data:', error);
  //     // Handle error appropriately
  //   }
  // };

  // const getData = () => {
  //   // getActivityData(item => setActivityData(item));

  //   getNewActivityByDeviceActivityId(deviceId , (item) => {setActivityData(item)} )
  // };

  const saveDraftData = async () => {
    const date = moment();
    const ActivityEndTime = date.format('YYYY-MM-DDTHH:mm:ss');

    await insertDraftItems(
      ActivityBy,
      DeviceActivityID,
      DeviceSystemDateTime,
      CustomerId,
      Notes,
      ActivityStartTime,
      ActivityEndTime,

      CustomerName,
      CustomerMobile,
      CustomerType,
      WorkingStatus,
      success => {
        if (success) {
          // toast.show('Draft data inserted successfully', {
          //   type: 'success',
          //   duration: 2000,
          // });
          getDraftallData();
          navigation.navigate('HomeScreen');
          // Call saveTimeTrackerData after saveDraftData
          saveTimeTrackerData(time);
        } else {
          Alert.alert('Failed to insert draft data');
          toast.show('Failed to insert draft data', {
            type: 'danger',
            duration: 2000,
          });
        }
      },
    );
  };

  // for time tracker
  const saveTimeTrackerData = ActivityTime => {
    const currentWorkingStatus = route.params?.WorkingStatus || 2; // Default to 2 if not provided
    insertTimeTrackerItems(
      DeviceActivityID,
      ActivityTime,
      // WorkingStatus,
      currentWorkingStatus,
      EntryBy,
      EntryDate,
      success => {
        if (success) {
          // toast.show('Pause data inserted successfully', {
          //   type: 'success',
          //   duration: 1500,
          // });

          getTimeTrackerAllData();
          // navigation.navigate('Draft');

          specificTimeTrackData();
        } else {
          // Alert.alert('Failed to insert Time Tracker data');
          toast.show('Failed to insert pause data', {
            type: 'success',
            duration: 2000,
          });
        }
      },
    );
  };

  const ResumeTimeTrackerData = DeviceActivityID => {
    const currentWorkingStatus = 3; // Default to 2 if not provided
    insertTimeTrackerItems(
      DeviceActivityID,
      ActivityTime,
      // WorkingStatus,
      currentWorkingStatus,
      EntryBy,
      EntryDate,

      success => {
        if (success) {
          // toast.show('Resume data inserted successfully', {
          //   type: 'success',
          //   duration: 1500,
          // });

          getTimeTrackerAllData();
          // navigation.navigate('Draft');

          specificTimeTrackData();
        } else {
          // Alert.alert('Failed to insert Time Tracker data');
          toast.show('Failed to insert resume data', {
            type: 'success',
            duration: 2000,
          });
        }
      },
    );
  };

  const SubmitTimeTrackerData = () => {
    const currentWorkingStatus = 4;
    insertTimeTrackerItems(
      deviceActivityId,
      ActivityTime,
      // WorkingStatus,
      currentWorkingStatus,
      EntryBy,
      EntryDate,

      success => {
        if (success) {
          // Alert.alert('Time Tracker Data inserted successfully');
          toast.show('submit data inserted successfully', {
            type: 'success',
            duration: 1500,
          });

          navigation.navigate('Activity Summary', {
            deviceId: value ? value.DeviceActivityId : deviceActivityId,
          });

          getTimeTrackerAllData();
          specificTimeTrackData();
        } else {
          // Alert.alert('Failed to insert Time Tracker data');
          toast.show('Failed to insert submit data', {
            type: 'success',
            duration: 2000,
          });
        }
      },
    );
  };

  useEffect(() => {
    if (route.params?.ActivityID) {
      ResumeTimeTrackerData(route.params?.ActivityID);

      // SubmitTimeTrackerData()
    }
  }, [route.params?.ActivityID]);

  const getDraftallData = () => {
    getDraftData(item => setDraftData(item));
  };

  const getTimeTrackerAllData = () => {
    getTimeTrackerData(item => setTimeTracker(item));
  };

  // const deleteData = (id = 2) => {
  //   deleteUser(id, (success) => {
  //     if (success) {
  //       getData();
  //       Alert.alert('User deleted successfully');
  //     } else {
  //       Alert.alert('Please insert a valid user Id');
  //     }
  //   });
  // };

  // ===================
  // get specific item using device activity id

  // useEffect(() => {
  //   // const deviceId = deviceActivityId;
  //   getTimeTrackerItemsByDeviceActivityId(DeviceActivityID, timeTrackerItems => {
  //     console.log(
  //       'Time Tracker specific Items: ,,,,,,,,,,,,,,',
  //       JSON.stringify(timeTrackerItems, null, 2),
  //     );
  //     // Do something with the retrieved data
  //   });
  // }, [isFocused, DeviceActivityID]);

  const specificTimeTrackData = () => {
    getTimeTrackerItemsByDeviceActivityId(
      DeviceActivityID,
      timeTrackerItems => {
        console.log(
          'Time Tracker specific Items: ,,,,,,,,,,,,,,',
          JSON.stringify(timeTrackerItems, null, 2),
        );
        // Do something with the retrieved data
      },
    );
  };

  // ====================================================

  const [appointmentData, setAppointmentData] = useState([]);
  const [activityData2, setActivityData2] = useState([]);
  const [activityItem, setActivityItem] = useState([]);
  const [activitySpecs, setActivitySpecs] = useState([]);
  const [activityTimeTrack, setActivityTimeTrack] = useState([]);

  // console.log(
  //   'this is saved activity data 2222',
  //   JSON.stringify(activityData, null, 2),
  // );

  useEffect(() => {
    getData2();
  }, [isFocused, deviceActivityId]);

  const getData2 = () => {
    // getAppoinmetData(item => setAppointmentData(item));
    getAppointmentsByDeviceActivityId(deviceActivityId, item => {
      setAppointmentData(item);
    });
    // getActivityData(item => setActivityData(item));
    getNewActivityByDeviceActivityId(deviceActivityId, item => {
      setActivityData2(item);
    });

    // getActivityItemData(item => setActivityItem(item));
    getActivityItemsByDeviceActivityId(deviceActivityId, item => {
      setActivityItem(item);
    });

    // getSpecificationData(item => setActivitySpecs(item));
    getSpecificationDataByDeviceActivityId(deviceActivityId, item => {
      setActivitySpecs(item);
    });

    getTimeTrackerItemsByDeviceActivityId(deviceActivityId, item => {
      setActivityTimeTrack(item);
    });
  };

  const apiResponseData = activityData2;

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
    'Total result ========== ',
    JSON.stringify(resultObject, null, 2),
  );

  return (


    <View style={customStyle.container}>
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* Activity no */}
          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <Text style={{color: '#000000', fontSize: 20}}>
              {/* Activity No: {activityData?.DeviceActivityId} */}
              {/* Activity No: {value ? value.DeviceActivityId :devID}  */}
              Activity No: {deviceActivityId}
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
              <Text style={{fontWeight: '600', color: 'black'}}>
                {' '}
                <Text style={{fontWeight: '800', color: 'black', fontSize: 15}}>
                  Date:
                </Text>{' '}
                {/* {moment(activityData?.ActivityStartTime).format('DD MMMM YYYY')} */}
                {moment(dateTime).format('DD MMM YYYY')}
              </Text>
            </View>
            <View>
              <Text style={{fontWeight: '600', color: 'black'}}>
                <Text
                  style={{fontWeight: 'bold', color: 'black', fontSize: 15}}>
                  Time:
                </Text>{' '}
                {/* {moment(activityData?.ActivityStartTime).format('hh:mm A')} */}
                {moment(dateTime).format('hh:mm A')}
                {/* {dateTime ? dateTime : ""} */}
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
                {activityCustomerName ? activityCustomerName : 'Default'}
                {/* {CustomerName ? CustomerName : 'Default'} */}
                {/* {CustomerName} CustomerName */}
              </Text>
            </View>
            <View>
              {/* <Text style={{fontWeight: '600', color: 'black'}}>
                <Text style={{fontWeight: '800', color: 'black', fontSize: 15}}>
                  Mobile:
                </Text>{' '}
                {activityCustomerMobile}
              </Text> */}
            </View>
          </View>

          {/* Cards */}
          <View style={{marginTop: 20}}>
            <View style={styles.content}>
              <TouchableOpacity
                style={styles.subContent}
                // onPress={() => navigation.navigate('Activity Customer')}
                onPress={() =>
                  navigation.navigate('Activity Customer', {
                    devID: deviceActivityId,
                    value: customer_id,
                  })
                }>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/customer.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Customer</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subContent}
                onPress={() =>
                  navigation.navigate('Activity Items', {
                    devID: deviceActivityId,
                  })
                }>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/items2.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Items</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subContent}
                onPress={() =>
                  navigation.navigate('Activity Specification', {
                    devID: deviceActivityId,
                  })
                }>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/specification.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Specification</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subContent}
                onPress={() =>
                  navigation.navigate('Appointment Screen', {
                    devID: deviceActivityId,
                  })
                }>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/appointment.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Appointment</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subContent}
                onPress={() => navigation.navigate('Order Delivery')}>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/shopping.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Delivery</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.subContent}
                // onPress={() => navigation.navigate('Note')}
                onPress={() =>
                  navigation.navigate('Note', {
                    devID: deviceActivityId,
                  })
                }>
                <View style={[styles.inner]}>
                  <View>
                    <Image
                      style={{width: 45, height: 50, resizeMode: 'contain'}}
                      source={require('../../../assets/homeScreen/note.png')}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>Note</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes */}

          {/* <View>
            <Text style={styles.label}>Notes</Text>
            <View style={{flex: 1}}>
              <TextInput
                multiline
                numberOfLines={4}
                style={[styles.input]}
                placeholder="Write notes here"
                placeholderTextColor="gray"
                onChangeText={text => setNotes(text)}
                value={notes}
              />
            </View>
          </View> */}

          {/* ============= Activity summary ================ */}

          {/* <View style={styles.first_container}>
            <Text style={styles.first_header_text}>Date: {resultObject.DeviceActivityId}</Text>
            <Text style={styles.first_header_text}>Customer Name: {resultObject.CustomerName}</Text>
            <Text style={styles.first_header_text}>
              Customer Address: {resultObject.CustomerAddress}
            </Text>
          </View> */}

          {/*========= Items details ==============*/}
          <View style={styles.order_container}>
            {resultObject.SalesPersonActivityItemDetailsDTOList.length > 0 && (
              <View style={{alignSelf: 'flex-start'}}>
                <Text
                  style={{fontSize: 17, fontWeight: '700', color: '#6C6D6D'}}>
                  Item Details
                </Text>
              </View>
            )}

            {/* ========================= Table section =========================== */}

            <View style={styles.wrapper}>
              {/* table container */}
              <View style={styles.table}>
                {/*========== table head ===========*/}

                {/* <View style={styles.table_head}>
                 
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
                </View> */}

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
                <Text
                  style={{fontSize: 17, fontWeight: '700', color: '#6C6D6D'}}>
                  Spec Details
                </Text>
              </View>
            )}

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
                        <Text style={styles.table_data}>
                          {' '}
                          {specDetail.Name}
                        </Text>
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

          {/* ===== Note ===== */}

          {resultObject?.Notes > '' && (
            <View>
              <Text style={{color: 'gray', fontSize: 16, fontWeight: '800'}}>
                Note: {''}
                <Text style={{color: 'gray', fontSize: 14, fontWeight: '800'}}>
                  {resultObject.Notes}
                </Text>
              </Text>
            </View>
          )}

          {/* ======== customer appointment ========= */}

          {resultObject.CustomerAppointmentDTOList.map((cusApp, index) => (
            <View style={styles.first_container}>
              <View key={index}>
                <View style={{marginBottom: 10}}>
                  <Text style={[styles.first_header_text, {fontWeight: '700'}]}>
                    {/* Appoinment No: {cusApp.CustomerId} */}
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

          {/* =========================== */}
        </View>
      </ScrollView>

      {/* button */}

      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          // alignItems: 'center',
          flexDirection: 'row',
          // marginVertical: 100,
          marginTop: 10,
          marginBottom: 20,
          gap: 20,
        }}>
  
        <TouchableOpacity
          // onPress={() => navigation.navigate('Activity Check')}

          style={{
            backgroundColor: '#F7D2D2AB',
            paddingHorizontal: 40,
            paddingVertical: 12,
            borderRadius: 50,
            borderColor: 'red',
            borderWidth: 1,
          }}
          onPress={() => saveDraftData()}>
          <Text style={{color: 'red', fontWeight: '700'}}>Pause</Text>
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
          onPress={() =>
            navigation.navigate('Activity Summary', {
              deviceId: value ? value.DeviceActivityId : deviceActivityId,
            })
          }
          // onPress={() => SubmitTimeTrackerData()}
        >
          <Text style={{color: '#04C1AA', fontWeight: '700'}}>Continue</Text>
        </TouchableOpacity>

      </View>
    </View>


  );
};

export default AllActivity;

const styles = StyleSheet.create({
  mainContainer: {
    // flex:1,
  },
  content: {
    // width: '100%',
    // height: '45%',
    // padding: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,

    // gap:5
  },
  cardContainer: {
    width: '33.3%',
    // height: '100%',
    padding: 5,
    height: 75,
    margin: 0,
  },

  // inner: {
  //   flex: 1,
  //   backgroundColor: '#C5E9E4',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   borderRadius: 10,
  //   gap: 5,
  // },

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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000000',
    fontFamily: 'Jost-Regular',
    marginTop: 10,
    fontWeight: '700',
  },
  button: {
    // borderWidth:1,
    width: '100%',
    alignSelf: 'flex-end',
    paddingHorizontal: 25,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: '#2FD790',
    elevation: 5,
    // flex:1,
  },

  // ========================================
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

    // flex:1,
    borderTopWidth: 1,
    borderColor: '#ced4da',

    backgroundColor: '#e9ecef',
    borderBottomWidth: 1,
    borderBottomColor: '#adb5bd',
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
    alignSelf: 'center',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
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

  subContent: {
    width: '33.3%',
    height: 100,
    padding: 5,
  },

  inner: {
    flex: 1,
    backgroundColor: '#C5E9E4', // #C5E9E4 #68C8FE
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    gap: 5,
    padding: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#090000',
    textAlign: 'center',
    lineHeight: 20,
  },
});
