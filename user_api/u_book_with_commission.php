<?php
require dirname(dirname(__FILE__)) . '/include/reconfig.php';
require dirname(dirname(__FILE__)) . '/include/estate.php';
header('Content-type: text/json');
$data = json_decode(file_get_contents('php://input'), true);
if ($data['prop_id'] == '' or $data['uid'] == '' or $data['check_in'] == '' or $data['check_out'] == '' or $data['subtotal'] == '' or $data['total'] == '' or $data['tax'] == '' or $data['p_method_id'] == '' or $data['book_for'] == '' or $data['prop_price'] == '') {
    $returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Something Went Wrong!"
    );
} else {
    $prop_id     = strip_tags(mysqli_real_escape_string($rstate, $data['prop_id']));
    $uid     = strip_tags(mysqli_real_escape_string($rstate, $data['uid']));
	$vp = $rstate->query("select * from tbl_user where id=".$uid."")->fetch_assoc();
	 if($vp['wallet'] >= $data['wall_amt'])
	 {
	$total_day	 = strip_tags(mysqli_real_escape_string($rstate, $data['total_day']));
    $check_in    = strip_tags(mysqli_real_escape_string($rstate, $data['check_in']));
    $check_out     = strip_tags(mysqli_real_escape_string($rstate, $data['check_out']));
    $subtotal  = strip_tags(mysqli_real_escape_string($rstate, $data['subtotal']));
    $total = strip_tags(mysqli_real_escape_string($rstate, $data['total']));
	$tax = strip_tags(mysqli_real_escape_string($rstate, $data['tax']));
	$noguest = strip_tags(mysqli_real_escape_string($rstate, $data['noguest']));
	$p_method_id = strip_tags(mysqli_real_escape_string($rstate, $data['p_method_id']));
	$book_for = strip_tags(mysqli_real_escape_string($rstate, $data['book_for']));
	$prop_price = strip_tags(mysqli_real_escape_string($rstate, $data['prop_price']));
	$add_note = strip_tags(mysqli_real_escape_string($rstate, $data['add_note']));
	$transaction_id = strip_tags(mysqli_real_escape_string($rstate, $data['transaction_id']));
	$cou_amt = strip_tags(mysqli_real_escape_string($rstate, $data['cou_amt']));
	$wall_amt = strip_tags(mysqli_real_escape_string($rstate, $data['wall_amt']));
    
    
   $check_date = $rstate->query("SELECT * FROM tbl_book WHERE (check_in BETWEEN '".$check_in."' and '".$check_out."' OR check_out BETWEEN '".$check_in."' and '".$check_out."') and prop_id=".$prop_id." and book_status!='Cancelled'");   
$properti = $rstate->query("select * from tbl_property where id=".$prop_id."")->fetch_assoc(); 
$prop_img = $properti['image'];
$prop_title = $properti['title'];
$add_user_id = $properti['add_user_id'];
    if ($check_date->num_rows != 0) {
        $returnArr = array(
            "ResponseCode" => "401",
            "Result" => "false",
            "ResponseMsg" => "That Date Range Already Booked!"
        );
    } else {
        
        if($book_for == 'self')
		{
			$timestamp    = date("Y-m-d");
			$table        = "tbl_book";
			 $field_values = array(
                    "prop_id",
                    "uid",
                    "check_in",
                    "check_out",
                    "subtotal",
                    "total",
                    "tax",
                    "p_method_id",
                    "book_for",
					"prop_price",
					"book_date",
					"add_note",
					"transaction_id",
					"cou_amt",
					"wall_amt",
					"total_day",
					"prop_title",
					"prop_img",
					"add_user_id",
					"noguest"
                );
                $data_values  = array(
                    "$prop_id",
                    "$uid",
                    "$check_in",
                    "$check_out",
                    "$subtotal",
                    "$total",
                    "$tax",
                    "$p_method_id",
                    "$book_for",
					"$prop_price",
					"$timestamp",
					"$add_note",
					"$transaction_id",
					"$cou_amt",
					"$wall_amt",
					"$total_day",
					"$prop_title",
					"$prop_img",
					"$add_user_id",
					"$noguest"
                );
                
                $h     = new Estate();
                $oid = $h->restateinsertdata_Api_Id($field_values, $data_values, $table);
				
				 if($wall_amt != 0)
{

	  $mt = intval($vp['wallet'])-intval($wall_amt);
  $table="tbl_user";
  $field = array('wallet'=>"$mt");
  $where = "where id=".$uid."";
$h = new Estate();
	  $check = $h->restateupdateData_Api($field,$table,$where);
	  
	  $table="wallet_report";
  $field_values=array("uid","message","status","amt","tdate");
  $data_values=array("$uid",'Wallet Used in Booking Id#'.$oid,'Debit',"$wall_amt","$timestamp");
   
      $h = new Estate();
	  $checks = $h->restateinsertdata_Api($field_values,$data_values,$table);
}

// Process commission and property owner payout
processCommissionAndPayout($oid, $add_user_id, $total, $rstate);

$tbwallet = $rstate->query("select * from tbl_user where id=".$uid."")->fetch_assoc();
$returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Booking Confirmed Successfully!!!","wallet"=>$tbwallet['wallet'],"book_id" =>$oid);	
		}
		else if($book_for == 'other')
		{

$timestamp    = date("Y-m-d");
$table        = "tbl_book";
			 $field_values = array(
                    "prop_id",
                    "uid",
                    "check_in",
                    "check_out",
                    "subtotal",
                    "total",
                    "tax",
                    "p_method_id",
                    "book_for",
					"prop_price",
					"book_date",
					"add_note",
					"transaction_id",
					"cou_amt",
					"wall_amt",
					"total_day",
					"prop_title",
					"prop_img",
					"add_user_id",
					"noguest"
                );
                $data_values  = array(
                    "$prop_id",
                    "$uid",
                    "$check_in",
                    "$check_out",
                    "$subtotal",
                    "$total",
                    "$tax",
                    "$p_method_id",
                    "$book_for",
					"$prop_price",
					"$timestamp",
					"$add_note",
					"$transaction_id",
					"$cou_amt",
					"$wall_amt",
					"$total_day",
					"$prop_title",
					"$prop_img",
					"$add_user_id",
					"$noguest"
                );
                
                $h     = new Estate();
                $oid = $h->restateinsertdata_Api_Id($field_values, $data_values, $table);
				
				
				 if($wall_amt != 0)
{

	  $mt = intval($vp['wallet'])-intval($wall_amt);
  $table="tbl_user";
  $field = array('wallet'=>"$mt");
  $where = "where id=".$uid."";
$h = new Estate();
	  $check = $h->restateupdateData_Api($field,$table,$where);
	  
	  $table="wallet_report";
  $field_values=array("uid","message","status","amt","tdate");
  $data_values=array("$uid",'Wallet Used in Booking Id#'.$oid,'Debit',"$wall_amt","$timestamp");
   
      $h = new Estate();
	  $checks = $h->restateinsertdata_Api($field_values,$data_values,$table);
}

$fname = strip_tags(mysqli_real_escape_string($rstate, $data['fname']));
$lname = strip_tags(mysqli_real_escape_string($rstate, $data['lname']));
$gender = strip_tags(mysqli_real_escape_string($rstate, $data['gender']));
$email = strip_tags(mysqli_real_escape_string($rstate, $data['email']));
$mobile = strip_tags(mysqli_real_escape_string($rstate, $data['mobile']));
$ccode = strip_tags(mysqli_real_escape_string($rstate, $data['ccode']));
$country = strip_tags(mysqli_real_escape_string($rstate, $data['country']));
$table        = "tbl_person_record";
$field_values = array(
                    "fname",
                    "lname",
                    "gender",
                    "email",
                    "mobile",
                    "ccode",
                    "country",
					"book_id"
                   
                );
                $data_values  = array(
                    "$fname",
                    "$lname",
                    "$gender",
                    "$email",
                    "$mobile",
                    "$ccode",
                    "$country",
					"$oid"
                    
                );
                
                $h     = new Estate();
                $vp = $h->restateinsertdata_Api($field_values, $data_values, $table);

// Process commission and property owner payout
processCommissionAndPayout($oid, $add_user_id, $total, $rstate);

$tbwallet = $rstate->query("select * from tbl_user where id=".$uid."")->fetch_assoc();
$returnArr = array("ResponseCode"=>"200","Result"=>"true","ResponseMsg"=>"Booking Confirmed Successfully!!!","wallet"=>$tbwallet['wallet'],"book_id" =>$oid);

		}
		else 
		{
			$returnArr = array(
        "ResponseCode" => "401",
        "Result" => "false",
        "ResponseMsg" => "Not Try Other Options!!"
    );
		}
        
    }
	
	$udata = $rstate->query("select * from tbl_user where id=".$uid."")->fetch_assoc();
$name = $udata['name'];

	   


$content = array(
       "en" => $name.', Your Booking #'.$oid.' Has Been Received.'
   );
$heading = array(
   "en" => "Booking Received!!"
);

$fields = array(
'app_id' => $set['one_key'],
'included_segments' =>  array("Active Users"),
'data' => array("order_id" =>$oid,"type"=>'normal'),
'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $uid)),
'contents' => $content,
'headings' => $heading
);
$fields = json_encode($fields);

 
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
curl_setopt($ch, CURLOPT_HTTPHEADER, 
array('Content-Type: application/json; charset=utf-8',
'Authorization: Basic '.$set['one_hash']));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HEADER, FALSE);
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
 
$response = curl_exec($ch);
curl_close($ch);

$timestamp = date("Y-m-d H:i:s");

$title_mains = "Booking Received!!";
$descriptions = 'New Booking #'.$oid.' Has Been Received.';

  $table="tbl_notification";
  $field_values=array("uid","datetime","title","description");
  $data_values=array("$uid","$timestamp","$title_mains","$descriptions");
  
    $h = new Estate();
	   $h->restateinsertdata_Api($field_values,$data_values,$table);
	   
	}
else 
{
 $tbwallet = $rstate->query("select * from tbl_user where id=".$uid."")->fetch_assoc();
$returnArr = array("ResponseCode"=>"200","Result"=>"false","ResponseMsg"=>"Wallet Balance Not There As Per Booking Amount Refresh One Time Screen!!!","wallet"=>$tbwallet['wallet']);	
}
}

echo json_encode($returnArr);

// Commission processing function
function processCommissionAndPayout($booking_id, $property_owner_id, $booking_amount, $rstate) {
    try {
        // Start database transaction
        $rstate->autocommit(false);
        
        // Get commission settings
        $commission_settings = $rstate->query("SELECT * FROM tbl_commission_settings ORDER BY id DESC LIMIT 1")->fetch_assoc();
        
        if (!$commission_settings) {
            error_log("Commission settings not found");
            return false;
        }
        
        $commission_rate = $commission_settings['commission_rate'];
        $payout_timing = $commission_settings['payout_timing'];
        $auto_payout = $commission_settings['auto_payout'];
        
        // Calculate commission and payout amounts
        $commission_amount = ($booking_amount * $commission_rate) / 100;
        $owner_payout = $booking_amount - $commission_amount;
        
        // Insert commission tracking record
        $h = new Estate();
        $tracking_fields = array("booking_id", "property_owner_id", "booking_amount", "commission_rate", "commission_amount", "owner_payout", "status");
        $tracking_values = array($booking_id, $property_owner_id, $booking_amount, $commission_rate, $commission_amount, $owner_payout, 'pending');
        $tracking_id = $h->restateinsertdata_Api_Id($tracking_fields, $tracking_values, "tbl_commission_tracking");
        
        // Process payout based on timing settings
        if ($payout_timing === 'immediate' && $auto_payout) {
            processPropertyOwnerPayout($tracking_id, $property_owner_id, $booking_id, $owner_payout, $rstate);
        }
        
        // Update platform earnings
        updatePlatformEarnings($booking_amount, $commission_amount, $owner_payout, $rstate);
        
        // Commit transaction
        $rstate->commit();
        
        // Send notification to property owner
        sendPropertyOwnerNotification($property_owner_id, $booking_id, $owner_payout, $rstate);
        
        return true;
        
    } catch (Exception $e) {
        // Rollback transaction on error
        $rstate->rollback();
        error_log("Commission processing error: " . $e->getMessage());
        return false;
    } finally {
        $rstate->autocommit(true);
    }
}

function processPropertyOwnerPayout($tracking_id, $owner_id, $booking_id, $amount, $rstate) {
    try {
        // Insert payout record
        $h = new Estate();
        $payout_fields = array("owner_id", "booking_id", "commission_tracking_id", "amount", "payout_method", "status");
        $payout_values = array($owner_id, $booking_id, $tracking_id, $amount, 'wallet', 'pending');
        $payout_id = $h->restateinsertdata_Api_Id($payout_fields, $payout_values, "tbl_property_owner_payouts");
        
        // Credit property owner's wallet
        $owner = $rstate->query("SELECT * FROM tbl_user WHERE id = $owner_id")->fetch_assoc();
        if ($owner) {
            $new_balance = $owner['wallet'] + $amount;
            $update_fields = array('wallet' => $new_balance);
            $update_where = "WHERE id = $owner_id";
            $h->restateupdateData_Api($update_fields, "tbl_user", $update_where);
            
            // Add wallet report entry for owner
            $timestamp = date("Y-m-d H:i:s");
            $report_fields = array("uid", "message", "status", "amt", "tdate");
            $report_values = array($owner_id, "Booking Payout for Booking #$booking_id", "Credit", $amount, $timestamp);
            $h->restateinsertdata_Api($report_fields, $report_values, "wallet_report");
            
            // Update payout status
            $payout_update = array('status' => 'completed', 'processed_at' => $timestamp);
            $payout_where = "WHERE id = $payout_id";
            $h->restateupdateData_Api($payout_update, "tbl_property_owner_payouts", $payout_where);
            
            // Update commission tracking status
            $tracking_update = array('status' => 'paid', 'payout_date' => $timestamp);
            $tracking_where = "WHERE id = $tracking_id";
            $h->restateupdateData_Api($tracking_update, "tbl_commission_tracking", $tracking_where);
            
            return true;
        }
        
        return false;
        
    } catch (Exception $e) {
        error_log("Payout processing error: " . $e->getMessage());
        return false;
    }
}

function updatePlatformEarnings($booking_amount, $commission_amount, $payout_amount, $rstate) {
    $today = date('Y-m-d');
    
    // Check if record exists for today
    $earnings_check = $rstate->query("SELECT * FROM tbl_platform_earnings WHERE date = '$today'");
    
    if ($earnings_check->num_rows > 0) {
        // Update existing record
        $earnings = $earnings_check->fetch_assoc();
        $new_bookings = $earnings['total_bookings'] + 1;
        $new_booking_amount = $earnings['total_booking_amount'] + $booking_amount;
        $new_commission = $earnings['total_commission'] + $commission_amount;
        $new_payouts = $earnings['total_payouts'] + $payout_amount;
        
        $update_query = "UPDATE tbl_platform_earnings SET 
                        total_bookings = $new_bookings,
                        total_booking_amount = $new_booking_amount,
                        total_commission = $new_commission,
                        total_payouts = $new_payouts
                        WHERE date = '$today'";
        $rstate->query($update_query);
    } else {
        // Insert new record
        $insert_query = "INSERT INTO tbl_platform_earnings (date, total_bookings, total_booking_amount, total_commission, total_payouts) 
                        VALUES ('$today', 1, $booking_amount, $commission_amount, $payout_amount)";
        $rstate->query($insert_query);
    }
}

function sendPropertyOwnerNotification($owner_id, $booking_id, $payout_amount, $rstate) {
    global $set;
    
    // Get owner data
    $owner = $rstate->query("SELECT * FROM tbl_user WHERE id = $owner_id")->fetch_assoc();
    if (!$owner) return;
    
    $owner_name = $owner['name'];
    
    // Send push notification
    $content = array(
        "en" => "Great news! You've received a payout of " . number_format($payout_amount) . " FCFA for booking #$booking_id"
    );
    $heading = array(
        "en" => "Payout Received!"
    );
    
    $fields = array(
        'app_id' => $set['one_key'],
        'included_segments' => array("Active Users"),
        'data' => array("booking_id" => $booking_id, "type" => 'payout'),
        'filters' => array(array('field' => 'tag', 'key' => 'user_id', 'relation' => '=', 'value' => $owner_id)),
        'contents' => $content,
        'headings' => $heading
    );
    
    $fields_json = json_encode($fields);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json; charset=utf-8',
        'Authorization: Basic ' . $set['one_hash']
    ));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_json);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    // Save notification to database
    $timestamp = date("Y-m-d H:i:s");
    $title = "Payout Received!";
    $description = "You've received a payout of " . number_format($payout_amount) . " FCFA for booking #$booking_id";
    
    $h = new Estate();
    $notification_fields = array("uid", "datetime", "title", "description");
    $notification_values = array($owner_id, $timestamp, $title, $description);
    $h->restateinsertdata_Api($notification_fields, $notification_values, "tbl_notification");
}
?>